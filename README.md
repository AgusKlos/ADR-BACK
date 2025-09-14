# Backend API - Agenda de Contactos

Este es el backend de la aplicación Agenda de Contactos, desarrollado con Node.js y Express, que proporciona una API REST para gestionar contactos con operaciones CRUD completas.

## Características

- ✅ API REST completa con operaciones CRUD
- ✅ Validación de datos con Joi
- ✅ Conexión a base de datos MySQL
- ✅ Manejo de errores centralizado
- ✅ Middleware de seguridad con Helmet
- ✅ CORS configurado para desarrollo y producción
- ✅ Búsqueda de contactos
- ✅ Validación de emails únicos
- ✅ Dockerizado y listo para producción

## Estructura del Proyecto

```
├── config/
│   └── database.js          # Configuración de base de datos
├── controllers/
│   └── contactController.js # Controladores de contactos
├── middleware/
│   └── errorHandler.js      # Manejo centralizado de errores
├── models/
│   └── Contact.js           # Modelo de datos de contactos
├── routes/
│   └── contacts.js          # Rutas de la API
├── scripts/
│   └── init-db.js           # Script de inicialización de DB
├── validators/
│   └── contactValidator.js  # Validaciones con Joi
├── .env                     # Variables de entorno
├── .gitignore
├── Dockerfile               # Configuración de Docker
├── package.json
└── server.js                # Punto de entrada de la aplicación
```

## Endpoints de la API

### Contactos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/contacts` | Obtener todos los contactos |
| GET | `/api/contacts?search=término` | Buscar contactos |
| GET | `/api/contacts/:id` | Obtener un contacto por ID |
| POST | `/api/contacts` | Crear un nuevo contacto |
| PUT | `/api/contacts/:id` | Actualizar un contacto |
| DELETE | `/api/contacts/:id` | Eliminar un contacto |

### Otros endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Información de la API |
| GET | `/health` | Estado de salud del servidor |

## Modelo de Datos - Contacto

```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "+54 11 1234-5678",
  "email": "juan.perez@email.com",
  "created_at": "2025-01-01T10:00:00.000Z",
  "updated_at": "2025-01-01T10:00:00.000Z"
}
```

## Instalación y Configuración

### Prerrequisitos

- Node.js 18 o superior
- MySQL 8.0 o superior
- npm o yarn

### Instalación Local

1. **Clonar e instalar dependencias:**
```bash
cd "TP ADR back"
npm install
```

2. **Configurar variables de entorno:**
Crear un archivo `.env` basado en `.env.example`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=contacts_db
PORT=3001
NODE_ENV=development
```

3. **Inicializar la base de datos:**
```bash
npm run init-db
```

4. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

5. **Ejecutar en modo producción:**
```bash
npm start
```

## Uso con Docker

### Construir la imagen

```bash
docker build -t contacts-backend .
```

### Ejecutar el contenedor

```bash
docker run -d \
  --name contacts-backend \
  -p 3001:3001 \
  -e DB_HOST=host.docker.internal \
  -e DB_USER=root \
  -e DB_PASSWORD=tu_password \
  -e DB_NAME=contacts_db \
  contacts-backend
```

### Docker Compose (Recomendado)

Crear un archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=rootpassword
      - DB_NAME=contacts_db
      - NODE_ENV=production
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=contacts_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

volumes:
  mysql_data:
```

Ejecutar con:
```bash
docker-compose up -d
```

## Ejemplos de Uso de la API

### Obtener todos los contactos
```bash
curl -X GET http://localhost:3001/api/contacts
```

### Crear un nuevo contacto
```bash
curl -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "+54 11 1234-5678",
    "email": "juan.perez@email.com"
  }'
```

### Actualizar un contacto
```bash
curl -X PUT http://localhost:3001/api/contacts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "telefono": "+54 11 9876-5432"
  }'
```

### Eliminar un contacto
```bash
curl -X DELETE http://localhost:3001/api/contacts/1
```

### Buscar contactos
```bash
curl -X GET "http://localhost:3001/api/contacts?search=Juan"
```

## Validaciones

El sistema valida automáticamente:

- **Nombre**: 2-50 caracteres, requerido
- **Apellido**: 2-50 caracteres, requerido  
- **Teléfono**: Formato válido de teléfono, requerido
- **Email**: Formato de email válido, único en el sistema, requerido

## Características de Seguridad

- Helmet para headers de seguridad
- Validación de entrada con Joi
- Sanitización automática de queries SQL
- CORS configurado apropiadamente
- Usuario no-root en Docker
- Manejo seguro de errores sin exposición de información sensible

## Scripts Disponibles

- `npm start` - Ejecutar en producción
- `npm run dev` - Ejecutar en desarrollo con nodemon
- `npm run init-db` - Inicializar base de datos

## Estado de Salud

El endpoint `/health` proporciona información sobre el estado del servidor:

```json
{
  "status": "OK",
  "timestamp": "2025-01-01T10:00:00.000Z",
  "environment": "development"
}
```

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Crear un Pull Request

## Licencia

ISC
