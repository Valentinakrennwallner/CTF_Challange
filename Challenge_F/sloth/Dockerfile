# syntax=docker/dockerfile:1

# Choose latest nginx and alpine image
FROM nginx:alpine

# Select the default dir where our files lie
WORKDIR /usr/share/nginx/html

# Use production node environment by default.
ENV NODE_ENV production

# Use Nginx default root for easyness
COPY src/assets /usr/share/nginx/html/assets
COPY src/ /usr/share/nginx/html

EXPOSE 80
