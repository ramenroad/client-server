# Multi Stage Build

#1. generate builder image
FROM node:18-alpine AS builder

RUN apk --no-cache add --virtual builds-deps build-base python3

RUN mkdir -p /app/ramenroad-client-server/
WORKDIR /app/ramenroad-client-server/
COPY . .

RUN rm package-lock.json || true

RUN yarn install --silent

ARG BUILD_ENV
ENV RUNTIME_BUILD_ENV=${BUILD_ENV}

#build builder image
RUN yarn build:${RUNTIME_BUILD_ENV}

#2. generate running image 
FROM node:18-alpine

RUN mkdir -p /app
WORKDIR /app

ARG BUILD_ENV
ENV RUNTIME_BUILD_ENV=${BUILD_ENV}

COPY --from=builder /app/ramenroad-client-server/dist ./dist
COPY --from=builder /app/ramenroad-client-server/node_modules ./node_modules
COPY --from=builder /app/ramenroad-client-server/.env.${RUNTIME_BUILD_ENV} ./.env

ENV HOST 0.0.0.0
EXPOSE 3000

CMD [ "node", "./dist/src/main.js" ]