#!/usr/bin/env bash
# Backend Docker image upload script for AWS SaaS Boost

# Ensure required tools are installed
if ! command -v jq &> /dev/null; then
  echo "jq is required but not installed. Please install jq and try again."
  exit 1
fi

read -p "Please enter your AWS SaaS Boost Environment label: " SAAS_BOOST_ENV
if [ -z "$SAAS_BOOST_ENV" ]; then
   echo "You must enter an AWS SaaS Boost Environment label to continue. Exiting."
   exit 1
fi

AWS_REGION=$(aws configure list | grep region | awk '{print $2}')
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --output text --query ["Account"])
echo "Using region: ${AWS_REGION} account: ${AWS_ACCOUNT_ID}"

SERVICE_NAME="backend"
SERVICE_JSON=$(aws ssm get-parameter --name /saas-boost/$SAAS_BOOST_ENV/app/$SERVICE_NAME/SERVICE_JSON --output text --query "Parameter.Value")
ECR_REPO=$(echo $SERVICE_JSON | jq .compute.containerRepo - | cut -d\" -f2)
ECR_TAG=$(echo $SERVICE_JSON | jq .compute.containerTag - | cut -d\" -f2)
ECR_TAG=${ECR_TAG:-"tag_1"}

if [ -z "$ECR_REPO" ]; then
    echo "Error: Could not retrieve ECR repository for backend. Exiting."
    exit 1
fi

DOCKER_REPO="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO"
DOCKER_TAG="$DOCKER_REPO:$ECR_TAG"

# Authenticate Docker with AWS ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $DOCKER_REPO

# Build and upload the backend image
docker image build -t backend -f backend/Dockerfile ./backend
docker tag backend:latest $DOCKER_TAG
docker push $DOCKER_TAG

echo "Backend image uploaded to $DOCKER_TAG"

