#!/usr/bin/env bash

# wait-for-it.sh: wait for a service to become available

set -e

TIMEOUT=15
QUIET=0

usage() {
  echo "Usage: $0 host:port [-t timeout] [-q]"
  exit 1
}

while getopts "t:q" opt; do
  case $opt in
    t) TIMEOUT=$OPTARG ;;
    q) QUIET=1 ;;
    *) usage ;;
  esac
done

shift $((OPTIND -1))

if [ $# -ne 1 ]; then
  usage
fi

HOST_PORT=(${1//:/ })
HOST=${HOST_PORT[0]}
PORT=${HOST_PORT[1]}

if [ -z "$HOST" ] || [ -z "$PORT" ]; then
  usage
fi

for i in $(seq $TIMEOUT); do
  if nc -z "$HOST" "$PORT"; then
    [ $QUIET -eq 0 ] && echo "Service is available"
    exit 0
  fi
  sleep 1
done

echo "Timeout occurred after waiting $TIMEOUT seconds for $HOST:$PORT"
exit 1
