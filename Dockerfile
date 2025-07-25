# Multi Stage Build

#1. generate builder image
FROM node:18-alpine AS builder

RUN apk --no-cache add --virtual builds-deps build-base python3

RUN mkdir -p /app/ramenroad-client-server/
WORKDIR /app/ramenroad-client-server/
COPY . .

RUN rm package-lock.json || true

RUN yarn install --silent

# GitHub Actions에서 전달된 환경 변수 정의
ARG BUILD_ENV
ARG DIGITAL_TWIN_KEY_DEV
ARG ENV_NAME
ARG JWT_AT_SECRET
ARG JWT_RT_SECRET
ARG KAKAO_REST_API_KEY
ARG MONGODB_DB_NAME
ARG MONGODB_URL
ARG S3_ACCESS_KEY
ARG S3_SECRET_KEY
ARG S3_BUCKET_NAME
ARG NAVER_DEVELOPERS_CLIENT_ID
ARG NAVER_DEVELOPERS_CLIENT_SECRET

# Build 환경 변수 설정
ENV RUNTIME_BUILD_ENV=${BUILD_ENV}
ENV DIGITAL_TWIN_KEY_DEV=${DIGITAL_TWIN_KEY_DEV}
ENV ENV_NAME=${ENV_NAME}
ENV JWT_AT_SECRET=${JWT_AT_SECRET}
ENV JWT_RT_SECRET=${JWT_RT_SECRET}
ENV KAKAO_REST_API_KEY=${KAKAO_REST_API_KEY}
ENV MONGODB_DB_NAME=${MONGODB_DB_NAME}
ENV MONGODB_URL=${MONGODB_URL}
ENV S3_ACCESS_KEY=${S3_ACCESS_KEY}
ENV S3_SECRET_KEY=${S3_SECRET_KEY}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}
ENV NAVER_DEVELOPERS_CLIENT_ID=${NAVER_DEVELOPERS_CLIENT_ID}
ENV NAVER_DEVELOPERS_CLIENT_SECRET=${NAVER_DEVELOPERS_CLIENT_SECRET}

# 환경 변수 확인 (디버깅용, 필요 시 주석 처리)
# RUN echo "BUILD_ENV=${RUNTIME_BUILD_ENV}" && \
#    echo "MONGODB_URL=${MONGODB_URL}" && \
#    echo "S3_BUCKET_NAME=${S3_BUCKET_NAME}"

#build builder image
RUN yarn build:${RUNTIME_BUILD_ENV}

#2. generate running image 
FROM node:18-alpine

RUN mkdir -p /app
WORKDIR /app

# 런타임에서도 환경 변수를 전달
ARG BUILD_ENV
ARG DIGITAL_TWIN_KEY_DEV
ARG ENV_NAME
ARG JWT_AT_SECRET
ARG JWT_RT_SECRET
ARG KAKAO_REST_API_KEY
ARG MONGODB_DB_NAME
ARG MONGODB_URL
ARG S3_ACCESS_KEY
ARG S3_SECRET_KEY
ARG S3_BUCKET_NAME
ARG NAVER_DEVELOPERS_CLIENT_ID
ARG NAVER_DEVELOPERS_CLIENT_SECRET

ENV RUNTIME_BUILD_ENV=${BUILD_ENV}
ENV DIGITAL_TWIN_KEY_DEV=${DIGITAL_TWIN_KEY_DEV}
ENV ENV_NAME=${ENV_NAME}
ENV JWT_AT_SECRET=${JWT_AT_SECRET}
ENV JWT_RT_SECRET=${JWT_RT_SECRET}
ENV KAKAO_REST_API_KEY=${KAKAO_REST_API_KEY}
ENV MONGODB_DB_NAME=${MONGODB_DB_NAME}
ENV MONGODB_URL=${MONGODB_URL}
ENV S3_ACCESS_KEY=${S3_ACCESS_KEY}
ENV S3_SECRET_KEY=${S3_SECRET_KEY}
ENV S3_BUCKET_NAME=${S3_BUCKET_NAME}
ENV NAVER_DEVELOPERS_CLIENT_ID=${NAVER_DEVELOPERS_CLIENT_ID}
ENV NAVER_DEVELOPERS_CLIENT_SECRET=${NAVER_DEVELOPERS_CLIENT_SECRET}

COPY --from=builder /app/ramenroad-client-server/dist ./dist
COPY --from=builder /app/ramenroad-client-server/node_modules ./node_modules

ENV HOST 0.0.0.0
EXPOSE 3000

CMD [ "node", "./dist/src/main.js" ]