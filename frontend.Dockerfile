# Dockerfile for client-react (React frontend)
FROM node:18-alpine as build

WORKDIR /app

COPY client-react/package.json client-react/package-lock.json ./
RUN npm install --legacy-peer-deps

COPY client-react .

RUN npm run build

# Serve build using serve
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
CMD ["serve", "-s", "build", "-l", "3000"]
