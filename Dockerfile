FROM node:12.18.1

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm run dev

COPY . .

CMD ["npm", "start"]