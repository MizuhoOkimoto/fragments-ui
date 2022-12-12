# Memo: Build stage: use ARG / Run stage: use ENV
# Build the fragments-ui web app and serve it via parcel

#############################################################################
# Set Up
FROM node:16.17.0@sha256:a5d9200d3b8c17f0f3d7717034a9c215015b7aae70cb2a9d5e5dae7ff8aa6ca8 AS dependencies

# Define some metadata about my image. The LABEL instruction adds key=value pairs 
# with arbitrary metadata about my image.
LABEL maintainer="Mizuho Okimoto <mokimoto@myseneca.ca>" \
      description="Fragments-ui web app"

# Reduce npm spam when installing within Docker.
# # Disable colour when run inside Docker.
ENV NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false
# Define for the image by default
ENV NODE_ENV=production

# Use /app as my working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/
# Copy all files into /app dir and change ownership to node user
#COPY --chown=node:node . /app/
# npm install
RUN npm ci --only=production

# Copy all the source files into the image filesystem
COPY . .
# npm run build
#RUN npm run build

# # Serve the dist/ on port 1234
# CMD npm run serve

# EXPOSE 1234

#############################################################################
# Build the app
FROM node:16.17.0@sha256:a5d9200d3b8c17f0f3d7717034a9c215015b7aae70cb2a9d5e5dae7ff8aa6ca8 AS build

# Use /app as my working directory
WORKDIR /app

# Copy the generated dependencies(node_modules). 
# From the 'dependencies' layer and copy the app dir to my current dir
COPY --from=dependencies /app /app

# Copy the source code 
COPY ./src /app/src

#############################################################################
# Serve the app
FROM nginx:1.22.0@sha256:f0d28f2047853cbc10732d6eaa1b57f1f4db9b017679b9fd7966b6a2f9ccc2d1 AS serve

#ARG NODE_VERSION=16

# Set up node.js
# https://github.com/nodesource/distributions/blob/master/README.md
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    nodejs\
    && rm -fr /var/lib/apt/lists/*

# Before npm start, explicit the user(node) instead of root for security
#USER node

# Copy my source code in
WORKDIR /usr/local/src/fragments-ui
COPY --from=build . .

# Copy the build site to the dir that nginx expects for static sites
# https://hub.docker.com/_/nginx
RUN cp -a ./app/. /usr/share/nginx/html/

# Run my service on port 80
EXPOSE 80

# Health Check
HEALTHCHECK --interval=15s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:80 || exit 1