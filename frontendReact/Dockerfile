# Etap build
FROM node:24-alpine AS build
WORKDIR /app

# Zainstaluj zależności systemowe potrzebne do niektórych paczek npm
RUN apk add --no-cache python3 make g++

# Skopiuj pliki package.json i package-lock.json
COPY package*.json ./

# Zainstaluj zależności
RUN npm install

# Skopiuj resztę kodu
COPY . .

# Build aplikacji React
RUN npm run build

# Etap produkcyjny - serwowanie przez Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]