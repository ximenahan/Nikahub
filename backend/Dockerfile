# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install any dependencies, including 'node_modules' for production only
RUN npm install --only=production

# Copy the rest of your application’s code into the container
COPY . .

# Compile the TypeScript (if your app is TypeScript-based)
#RUN npm run build

# The app binds to port 3000 unless configured otherwise
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD ["node", "dist/main"]

