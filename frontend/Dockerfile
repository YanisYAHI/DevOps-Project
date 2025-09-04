# Étape 1 : Build Angular app
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Étape 2 : Servir avec nginx
FROM nginx:alpine
COPY --from=build /app/dist/mini-spotify /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]