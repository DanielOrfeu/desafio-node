FROM node:20-alpine

WORKDIR /desafio-node

COPY . .

RUN rm -rf node_modules
RUN npm install

CMD [ "npm", "start" ]

EXPOSE 3333