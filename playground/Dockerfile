FROM node:18-alpine3.18
# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev

WORKDIR /opt/
COPY ./package.json ./yarn.lock ./

WORKDIR /opt/.yalc/
COPY ./.yalc ./

WORKDIR /opt/
RUN npm config set fetch-retry-maxtimeout 600000 -g && yarn install

WORKDIR /opt/app
COPY . .
ENV PATH /opt/node_modules/.bin:$PATH

# Register all the args passed through the build command
ARG PUBLIC_URL

# Set the ENV vars based on the args
ENV PUBLIC_URL=$PUBLIC_URL

# Run the app
RUN ["yarn", "run", "build"]
EXPOSE 1337
CMD ["yarn", "run", "start"]
