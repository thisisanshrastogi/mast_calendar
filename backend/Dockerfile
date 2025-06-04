FROM node:24
WORKDIR /backend-app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
