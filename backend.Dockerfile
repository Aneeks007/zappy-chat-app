# Dockerfile for server-express (Express backend)
FROM node:18-alpine

WORKDIR /app

COPY server-express/package.json server-express/package-lock.json ./
RUN npm install

COPY server-express .

EXPOSE 5000
CMD ["npm", "start"]
