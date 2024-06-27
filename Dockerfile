FROM node:18 
WORKDIR /app
COPY package*.json ./
COPY . .
COPY .env.docker .env
RUN npm install
RUN npm run build 
CMD [ "npm", "run", "start:dev" ]