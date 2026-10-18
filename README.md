# Autenticación REST con Clean Architecture

Proyecto personal de aprendizaje desarrollado como parte de un curso de **Fernando Herrera en DevTalles**. Implementa una API REST de registro e inicio de sesión con JWT, aplicando separación de responsabilidades e inyección de dependencias con Clean Architecture.

## Tecnologías

- Node.js y TypeScript en modo estricto, con módulos ESM.
- Express 5 para la API HTTP.
- MongoDB y Mongoose para persistencia.
- bcryptjs para el hash de contraseñas.
- jsonwebtoken para generar y verificar tokens JWT.
- Docker Compose para la base de datos local.

## Funcionalidades

- Registro de usuarios con validación de nombre, correo y contraseña.
- Inicio de sesión con comprobación del hash de contraseña.
- Emisión de tokens JWT con vigencia de dos horas.
- Ruta protegida que valida el token y recupera el usuario autenticado.
- Manejo de errores controlados mediante `CustomError`.

## Ejecutar localmente

Requisitos: Node.js compatible con `--env-file` (20.6 o superior), npm y Docker con Compose. Las dependencias pueden exigir una versión de Node más reciente; revisa sus requisitos si la instalación muestra advertencias de compatibilidad.

```sh
git clone https://github.com/Jerick97/node-auth-clean-architecture.git
cd node-auth-clean-architecture
npm ci
```

Copiar `.env.example` a `.env`. En PowerShell:

```powershell
Copy-Item .env.example .env
```

Configurar `.env` con estas variables. El ejemplo siguiente coincide con el servicio MongoDB de `docker-compose.yml` para desarrollo local:

```dotenv
PORT=3100
MONGO_URL=mongodb://mongo-user:123456@localhost:27017/?authSource=admin
MONGO_DB_NAME=auth
JWT_SEED=reemplazar_por_un_secreto_aleatorio
```

`JWT_SEED` es obligatoria aunque todavía no aparece en `.env.example`. Genera un valor aleatorio para tu entorno y agrégalo a `.env`; no publiques este archivo. Puedes generar el secreto con:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Levantar MongoDB e iniciar la API:

```sh
docker compose up -d
npm run dev
```

La API estará disponible en `http://localhost:3100/api/auth`. El puerto 27017 debe estar libre para MongoDB. Sus datos se guardan en la carpeta local `mongo/`.

## Endpoints

| Método | Ruta | Descripción | Autenticación |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Registrar un usuario | No |
| `POST` | `/api/auth/login` | Iniciar sesión | No |
| `GET` | `/api/auth/` | Obtener el usuario autenticado | Bearer JWT |

### Registro

Enviar un cuerpo JSON a `POST /api/auth/register`:

```json
{
  "name": "Usuario de prueba",
  "email": "usuario@example.com",
  "password": "clave-de-prueba-123"
}
```

El nombre debe tener al menos tres caracteres, el correo un formato válido y la contraseña al menos ocho caracteres.

### Inicio de sesión

Enviar un cuerpo JSON a `POST /api/auth/login`:

```json
{
  "email": "usuario@example.com",
  "password": "clave-de-prueba-123"
}
```

Registro e inicio de sesión devuelven un objeto con esta estructura:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "<id-del-usuario>",
    "name": "Usuario de prueba",
    "email": "usuario@example.com",
    "roles": ["USER_ROLE"]
  }
}
```

### Ruta protegida

Enviar `GET /api/auth/` con el encabezado:

```http
Authorization: Bearer <jwt>
```

Devuelve el usuario autenticado bajo la propiedad `user`. Aunque el controlador llama al método `getUsers`, la respuesta actual no lista todos los usuarios. Un token ausente, inválido o vencido produce una respuesta `401`.

## Organización

```text
src/
├── app.ts           # Conexión a MongoDB y arranque del servidor
├── config/          # Variables de entorno y adaptadores JWT/bcrypt
├── data/mongodb/    # Conexión y modelos de Mongoose
├── domain/          # Entidades, DTO, errores, contratos y casos de uso
├── infrastructure/  # Repositorios, datasources y mappers concretos
└── presentation/    # Rutas, controladores, middlewares y servidor Express
```

El flujo de registro e inicio de sesión pasa por controlador, DTO, caso de uso, repositorio y datasource. Las implementaciones se conectan en las rutas mediante inyección de dependencias.

Es una implementación de aprendizaje en evolución: el controlador y el middleware aún consultan directamente el modelo de Mongoose, y los casos de uso dependen del adaptador JWT de configuración.

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Ejecutar con recarga automática mediante tsx y cargar `.env` |
| `npm run typecheck` | Verificar tipos sin generar archivos |
| `npm run build` | Compilar TypeScript en `dist/` |
| `npm start` | Ejecutar el código compilado y cargar `.env` |

Para ejecutar la versión compilada, primero usar `npm run build` y luego `npm start`. Actualmente no hay scripts de pruebas automatizadas ni lint.

## Alcance

El proyecto contiene el flujo básico de autenticación trabajado durante el curso. No implementa refresh tokens, cierre de sesión con revocación, recuperación de contraseña ni verificación de correo. La configuración de Docker está destinada al desarrollo local.

Licencia declarada en `package.json`: ISC.
