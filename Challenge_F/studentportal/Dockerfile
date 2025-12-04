# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.21.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV development

WORKDIR /usr/src/app

# Copy the rest of the source files into the image.
COPY app /usr/src/app/app
COPY components /usr/src/app/components
COPY lib /usr/src
COPY . /usr/src/app/

RUN npm ci

# copy entrypoint (added) and make executable
COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# Normalize CRLF -> LF (helps when the source file came from Windows)
RUN sed -i 's/\r$//' /usr/src/app/entrypoint.sh

# Expose the port that the application listens on.
EXPOSE 3000

# Use sh with the absolute path so the script runs reliably regardless of shebang/line endings
ENTRYPOINT ["sh", "/usr/src/app/entrypoint.sh"]
