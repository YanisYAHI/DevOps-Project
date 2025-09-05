# Étape 1 : Build Angular app
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

FROM nginx:stable

COPY default.conf /etc/nginx/conf.d
COPY --from=build /app/dist/mini-spotify/browser /usr/share/nginx/html

EXPOSE 80
