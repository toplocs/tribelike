FROM node:latest as build-stage

WORKDIR /app

RUN corepack enable pnpm && corepack install -g pnpm@latest-9

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./

RUN pnpm fetch

COPY ./ .
RUN pnpm install -r --offline
RUN pnpm build

EXPOSE 8080
CMD [ "node", "server.js" ]


FROM node:alpine as dev

WORKDIR /home/node/app
RUN apk add openssl
RUN corepack enable pnpm && corepack install -g pnpm@latest-9

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./

RUN pnpm fetch

COPY . .
RUN pnpm install -r --offline

RUN cp .env.default .env
RUN pnpm prisma generate --generator client


FROM dev as prod
ENV NODE_PATH=./build
ENV NODE_ENV=production
RUN pnpm build