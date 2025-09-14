# Usar la imagen oficial de Node.js LTS
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Copiar el código fuente de la aplicación
COPY . .

# Cambiar propiedad de los archivos al usuario no-root
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Exponer el puerto en el que correrá la aplicación
EXPOSE 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001

# Comando de salud para Docker
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http=require('http'); http.get('http://localhost:3001/health', (res) => {process.exit(res.statusCode === 200 ? 0 : 1)}).on('error', () => {process.exit(1)})"

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
