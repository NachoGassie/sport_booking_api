FROM node:20.12-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT

CMD [ "npm", "run", "start:dev" ]