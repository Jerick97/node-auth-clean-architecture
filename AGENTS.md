# Instrucciones para agentes — node-auth

## Contexto y alcance

- Proyecto personal de aprendizaje: API REST de autenticación con Clean Architecture.
- Responder en español, de forma directa. Explicar las decisiones cuando ayuden a comprender el curso.
- Estas instrucciones aplican a `node-auth/` y sus subdirectorios. Respetar las instrucciones superiores.
- Mantener los cambios acotados a la tarea. No completar módulos del curso ni refactorizar otras capas sin que se solicite.
- No incorporar código, datos ni configuración de proyectos de trabajo o de clientes.

## Stack y convenciones

- Node.js, TypeScript estricto, Express 5, MongoDB con Mongoose, bcryptjs y jsonwebtoken.
- npm como gestor de paquetes; mantener `package-lock.json` sincronizado si cambian dependencias.
- ESM (`"type": "module"`) con `module` y `moduleResolution` en `NodeNext`.
- Usar extensión `.js` en imports relativos de TypeScript para que funcionen tras compilar.
- Seguir el estilo del archivo editado: tabulaciones, comillas dobles y punto y coma en el código existente.
- Mantener nombres de archivos como `*.use-case.ts`, `*.dto.ts`, `*.repository.impl.ts` y `*.datasource.impl.ts`.
- Preferir tipos explícitos e `unknown` para entradas sin validar; evitar introducir nuevos `any`.
- Usar los archivos `index.ts` existentes cuando corresponda y evitar dependencias circulares.

## Organización del código

| Ruta | Responsabilidad |
| --- | --- |
| `src/app.ts` | Arranque: conexión a MongoDB e inicio del servidor. |
| `src/domain/entities/` | Entidades del negocio. |
| `src/domain/dto/` | Validación y construcción de datos de entrada. |
| `src/domain/use-cases/` | Casos de uso de registro e inicio de sesión. |
| `src/domain/repositories/` | Contratos de repositorios. |
| `src/domain/datasources/` | Contratos de fuentes de datos. |
| `src/domain/errors/` | Errores controlados mediante `CustomError`. |
| `src/infrastructure/` | Implementaciones de repositorios, datasources y mappers. |
| `src/data/mongodb/` | Conexión y modelos de persistencia con Mongoose. |
| `src/presentation/` | Servidor Express, rutas, controladores y middlewares. |
| `src/config/` | Variables de entorno, validadores y adaptadores JWT/bcrypt. |

## Reglas de arquitectura

- Flujo de autenticación: ruta → controlador → DTO/caso de uso → contrato de repositorio → implementación → datasource → MongoDB.
- Los controladores traducen HTTP y delegan las operaciones de negocio; los casos de uso dependen de contratos.
- Conectar las implementaciones mediante inyección por constructor, siguiendo el armado de `src/presentation/auth/routes.ts`.
- Mantener la conversión entre documentos de Mongoose y entidades en los mappers.
- Para funcionalidad nueva, evitar dependencias de Express o Mongoose en el dominio.
- Hay excepciones actuales: los casos de uso importan el adaptador JWT y tipos de jsonwebtoken; el controlador y el middleware consultan `UserModel` directamente. No tomar estas excepciones como patrón para ampliar el proyecto ni corregirlas fuera del alcance solicitado.
- Los DTO existentes usan `create()` y devuelven una tupla con error o instancia. Preservar ese contrato al modificarlos.
- Usar `CustomError` para fallos controlados y mantener las respuestas HTTP coherentes con el manejo de errores existente.

## Contrato HTTP actual

- `POST /api/auth/register`: registro; devuelve token y datos del usuario.
- `POST /api/auth/login`: inicio de sesión; devuelve token y datos del usuario.
- `GET /api/auth/`: ruta protegida mediante `Authorization: Bearer <token>`; actualmente devuelve el usuario autenticado bajo `user`.
- No cambiar rutas, códigos HTTP ni formatos de respuesta como efecto secundario de otra tarea.
- Al tocar autenticación, verificar entradas inválidas, credenciales incorrectas, correo duplicado y token ausente, inválido o vencido, según el cambio.

## Seguridad y configuración

- No leer ni mostrar `.env` salvo necesidad explícita de la tarea. Nunca registrar contraseñas, hashes, tokens ni secretos.
- No versionar `.env`, `node_modules/`, `dist/` ni `mongo/`. No modificar archivos generados para corregir el código fuente.
- Las contraseñas se almacenan con hash usando `BcryptAdapter`; JWT se genera y valida mediante `JwtAdapter`.
- Las respuestas de usuario deben excluir contraseñas y hashes, también en rutas protegidas.
- No confiar en roles o identificadores enviados por el cliente para conceder permisos.
- Variables obligatorias según `src/config/envs.ts`: `PORT`, `MONGO_URL`, `MONGO_DB_NAME` y `JWT_SEED`.
- `.env.example` actualmente omite `JWT_SEED`. Si la tarea incluye configuración, mantener el ejemplo alineado usando valores ficticios.
- `docker-compose.yml` levanta el servicio local `mongo-db-auth`, publica el puerto 27017 y persiste datos en `mongo/`. Su configuración es de desarrollo.
- No borrar volúmenes, datos locales ni ejecutar `docker compose down -v` sin autorización expresa.

## Comandos y validación

Ejecutar desde `node-auth/`:

```powershell
npm ci                  # Instalar las dependencias del lockfile cuando haga falta
docker compose up -d    # Levantar MongoDB local cuando la tarea lo requiera
npm run dev             # Desarrollo con tsx watch y .env
npm run typecheck       # Comprobar tipos sin generar archivos
npm run build           # Compilar src/ hacia dist/
npm start               # Ejecutar dist/app.js con .env; requiere compilación previa
```

- No hay scripts de tests ni lint configurados. No afirmar que se ejecutaron ni inventar comandos.
- Para cambios de TypeScript, ejecutar `npm run typecheck`; comprobar también el build cuando se modifiquen imports o configuración de compilación.
- Avisar antes de generar archivos de salida en el workspace, incluido `dist/`.
- Para cambios de comportamiento, verificar los escenarios afectados; añadir pruebas útiles cuando el alcance lo justifique.
- Informar qué se verificó y cualquier limitación real. Una comprobación de tipos no valida el flujo HTTP ni la conexión a MongoDB.

## Trabajo con el repositorio

- Revisar `git status` antes de editar y conservar los cambios ajenos a la tarea.
- Si existe `graphify-out/graph.json`, consultarlo antes de explorar el código con búsquedas amplias.
- Buscar documentación existente antes de crear archivos en `docs/`; actualizar la referencia vigente.
- No fijar `user.name` ni `user.email`: la identidad la resuelve la configuración global.
- No hacer commits, pushes ni cambios de ramas salvo solicitud o autorización del usuario.
