FROM node:18-slim

LABEL "com.github.actions.name"="GitHub Action for Sanity.io"
LABEL "com.github.actions.description"="Wraps the Sanity CLI to enable common commands."
LABEL "com.github.actions.icon"="upload-cloud"
LABEL "com.github.actions.color"="red"

RUN yarn global add @sanity/cli

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
