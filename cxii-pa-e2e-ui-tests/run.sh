#!/bin/bash
set -e

# Default command values
env=local # Possible values: local, dev, canary

# Extract commands
while [[ "$1" =~ ^- && ! "$1" == "--" ]]; do case $1 in
  --help )
    echo "Usage: ./run.sh [command]"
    echo "Commands:"
    echo "--help                 Displays this help info."
    echo
    echo "--env <env>            Choose the environment you want to run the test against."
    echo "                       <env> is either 'local', 'dev', 'canary', 'prod-usea' or 'prod-dewc'."
    echo "                       Defaults to 'local' if not specified."
    echo "                       "
    exit
    ;;
  --env )
    shift; env=$1
    ;;
esac; shift; done
if [[ "$1" == '--' ]]; then shift; fi

# Commands validation
if [ "$env" != "local" ] && [ "$env" != "dev" ] && [ "$env" != "canary" ] && [ "$env" != "prod-usea" ] && [ "$env" != "prod-dewc" ]; then
  echo "Invalid environment. Please choose either 'local', 'dev', 'canary', 'prod-usea' or 'prod-dewc'."
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install
npx playwright install --with-deps

# Run the test
echo "Running test against $env environment..."
npm run test:$env