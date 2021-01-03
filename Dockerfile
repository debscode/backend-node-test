FROM node:12.18.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

#prod
#CMD ["npm", "start"]