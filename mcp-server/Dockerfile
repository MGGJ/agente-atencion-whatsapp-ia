FROM node:18

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

RUN npm install 

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto del MCP Server
EXPOSE 4000

# Comando para arrancar el servidor
#CMD ["npm", "start"]


#comando para ejecutar el servidor sin usar npm start, directamente con node
CMD ["node", "src/index.js"]
