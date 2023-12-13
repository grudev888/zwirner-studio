#!/bin/sh -l

set -e

if [ -z "$SANITY_AUTH_TOKEN" ]; then
    echo "Please set the secret SANITY_AUTH_TOKEN environment variable."
    exit 126
fi

if [ -z "$SANITY_PROJECT_ID" ]; then
    echo "Please set the secret SANITY_PROJECT_ID environment variable."
    exit 126
fi

if [ -z "$SANITY_DATABASE" ]; then
    echo "Please set the SANITY_DATABASE environment variable."
    exit 126
fi

# Copy sanity.cli.ts to root
sh -c "cp ./.github/actions/sanity-cli/sanity.cli.ts ."

# Set environment variables
export SANITY_STUDIO_PROJECT_ID="$SANITY_PROJECT_ID"
export SANITY_STUDIO_TEST_DATABASE="$SANITY_DATABASE"

# Install Sanity CLI
sh -c "sanity install"

# Run sanity command
sh -c "SANITY_AUTH_TOKEN='$SANITY_AUTH_TOKEN' sanity $*"
