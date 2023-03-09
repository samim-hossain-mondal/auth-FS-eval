FROM alpine:latest

RUN apk add --update nodejs npm

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

CMD [ "npm","run","start" ]