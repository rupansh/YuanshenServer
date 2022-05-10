FROM node:lts-alpine as builder

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

ENV PATH="/aarch64-linux-musl-cross/bin:/usr/local/cargo/bin/rustup:/root/.cargo/bin:$PATH" \
  RUSTFLAGS="-C target-feature=-crt-static" \
  CC="clang" \
  CXX="clang++" \
  GN_EXE=gn

RUN apk add --update --no-cache wget musl-dev && \
  sed -i -e 's/v[[:digit:]]\..*\//edge\//g' /etc/apk/repositories && \
  apk add --update --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing \
  rustup \
  bash \
  python3 \
  python2 \
  git \
  build-base \
  clang \
  cmake \
  llvm \
  gn \
  tar \
  ninja && \
  apk upgrade

RUN rustup-init -y && \
  yarn global add pnpm

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm i

COPY . .

RUN pnpx nx build network-server

FROM node:lts-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache openssh

RUN yarn global add pnpm

COPY --from=builder /root/.pnpm-store /root/.pnpm-store

WORKDIR /app

COPY --from=builder /app .

CMD ["pnpx", "nx", "serve", "network-server"]