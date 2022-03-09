FROM node:lts-alpine 

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh curl

RUN curl -f https://get.pnpm.io/v6.js | node - add --global pnpm@6

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm i

COPY . .

RUN pnpx nx build dispatch-server

CMD ["node", "./dist/packages/dispatch-server/main.js"]