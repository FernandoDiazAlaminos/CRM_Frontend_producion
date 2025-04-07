# 🔹 Etapa 1: Build de la app con Vite
FROM node:22-alpine as build

WORKDIR /app

# Copiamos solo lo necesario primero para aprovechar la cache de Docker
COPY package*.json ./

RUN npm install

# Ahora sí copiamos todo lo demás
COPY . .

# Ejecutamos el build (esto generará /dist)
RUN npm run build

# 🔹 Etapa 2: Imagen liviana para producción
FROM node:22-alpine

# Instalar PM2 de forma global
RUN npm install -g pm2

WORKDIR /app

# Copiar el build
COPY --from=build /app/dist ./dist

# Copiar solo los archivos necesarios para ejecutar el servidor
COPY package*.json ./
COPY server.js .
COPY ecosystem.config.js .

# Instalamos solo dependencias de producción
RUN npm install --omit=dev

EXPOSE 3000

# Arrancamos el servidor con PM2
CMD ["pm2-runtime", "server.js", "--name", "client"]
