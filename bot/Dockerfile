FROM node:18.16.1-alpine
WORKDIR /app
ADD package*.json ./
RUN npm install
COPY . .
EXPOSE 10000
CMD [ "npm", "start"]