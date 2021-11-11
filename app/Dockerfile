FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json .npmrc ./

RUN npm i --save @fortawesome/pro-duotone-svg-icons @fortawesome/pro-regular-svg-icons

RUN npm install

EXPOSE 3000

COPY . .

CMD ["npm", "start"]