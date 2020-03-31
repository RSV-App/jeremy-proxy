FROM node:10.15-alpine

RUN mkdir -p /src/proxy

WORKDIR /src/proxy

COPY . /src/proxy

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]