FROM node:18 
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
COPY .env.docker .env 
RUN npm run build 
CMD [ "npm", "run", "start:dev" ]