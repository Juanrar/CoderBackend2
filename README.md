# API Backend — Plataforma de Eventos

API REST para la gestión de eventos y la inscripción de usuarios mediante tickets.
Proyecto final del curso de Backend (CoderHouse), construido como evolución de las
pre-entregas anteriores.

La API permite registrar usuarios con distintos roles, crear y publicar eventos,
inscribirse a ellos con control de cupo y duplicados, y notificar por email la
confirmación de cada inscripción.

---

## Tecnologías

| Herramienta | Uso |
|---|---|
| Node.js + Express 5 | Servidor HTTP y ruteo |
| MongoDB + Mongoose | Persistencia |
| mongoose-paginate-v2 | Paginación del listado de eventos |
| Passport.js | Estrategias `register`, `login` y `current` |
| passport-local / passport-jwt | Autenticación por credenciales y por token |
| jsonwebtoken | Firma y verificación del JWT |
| bcryptjs | Hasheo de contraseñas |
| cookie-parser | Lectura del token desde cookie httpOnly |
| Nodemailer | Envío de emails de confirmación |
| dotenv | Carga de variables de entorno |

---

## Instalación

Requisitos previos: **Node.js 20+** y una instancia de **MongoDB** (local o Atlas).

```bash
git clone https://github.com/Juanrar/CoderBackend2.git
cd CoderBackend2
npm install
cp .env.example .env      # en Windows: copy .env.example .env
```

Luego editá el archivo `.env` con tus credenciales reales (ver sección siguiente)
y levantá el servidor:

```bash
npm run dev
```

Si todo está bien vas a ver:

```
Base de datos conectada
Servidor escuchando en el puerto 8080
```

---

## Variables de entorno

El archivo `.env` **no se versiona** (está en `.gitignore`). Usá `.env.example`
como plantilla.

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `8080` |
| `MONGO_URL` | Cadena de conexión a MongoDB | `mongodb://localhost:27017/coderbackend2` |
| `JWT_SECRET` | Secreto para firmar el JWT | `una-cadena-larga-y-aleatoria` |
| `JWT_EXPIRES_IN` | Vigencia del token | `1d` |
| `JWT_COOKIE_EXPIRES_IN` | Vigencia de la cookie, en segundos | `86400` |
| `NODE_ENV` | Entorno de ejecución | `development` / `production` |
| `MAIL_HOST` | Host SMTP | `smtp.gmail.com` |
| `MAIL_PORT` | Puerto SMTP | `587` |
| `MAIL_USER` | Usuario SMTP | `tu-cuenta@gmail.com` |
| `MAIL_PASS` | Contraseña o app password | `xxxx xxxx xxxx xxxx` |
| `MAIL_FROM` | Remitente de los emails | `Eventos <tu-cuenta@gmail.com>` |

> **Nota sobre Gmail:** requiere una *contraseña de aplicación* (con verificación
> en dos pasos activada), no la contraseña de la cuenta.

> **Nota sobre `NODE_ENV`:** la cookie del token se emite con `secure: true`
> únicamente cuando `NODE_ENV=production`. En desarrollo debe quedar en
> `development`, de lo contrario el navegador descarta la cookie sobre HTTP y
> todas las rutas protegidas responden 401.

---

## Comandos

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor |
| `npm run dev` | Inicia el servidor con recarga automática (`node --watch`) |

---

## Roles y permisos

| Rol | Permisos |
|---|---|
| `user` | Rol por defecto. Se inscribe a eventos, consulta y cancela sus propios tickets |
| `organizer` | Todo lo anterior + crea eventos y gestiona **los suyos** (editar, cambiar estado, ver inscriptos) |
| `admin` | Gestiona **cualquier** evento y cancela **cualquier** ticket |

El registro público **siempre** crea usuarios con rol `user`: el campo `role`
enviado en el body se ignora.

### Cómo crear usuarios de prueba

1. Registrá los tres usuarios por la API (todos nacen como `user`):

```bash
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Ana","last_name":"Admin","email":"admin@test.com","password":"123456"}'
```

Repetí con `organizer@test.com` y `user@test.com`.

2. Promové los roles directamente en la base de datos:

```bash
mongosh "mongodb://localhost:27017/coderbackend2" --eval '
  db.users.updateOne({ email: "admin@test.com" },     { $set: { role: "admin" } });
  db.users.updateOne({ email: "organizer@test.com" }, { $set: { role: "organizer" } });
'
```

3. Volvé a hacer login con esas cuentas para obtener un token con el rol actualizado.

---

## Endpoints

Base URL: `http://localhost:8080`

### Autenticación — `/api/sessions`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/register` | — | Registra un usuario (rol `user`) |
| `POST` | `/login` | — | Inicia sesión y emite la cookie `authToken` |
| `GET` | `/current` | ✅ | Devuelve el usuario autenticado |
| `POST` | `/logout` | ✅ | Elimina la cookie de sesión |

### Eventos — `/api/events`

| Método | Ruta | Auth | Rol | Descripción |
|---|---|---|---|---|
| `GET` | `/` | — | — | Listado con filtros, paginación y orden |
| `GET` | `/:eid` | — | — | Detalle de un evento |
| `POST` | `/` | ✅ | `organizer`, `admin` | Crea un evento |
| `PUT` | `/:eid` | ✅ | dueño o `admin` | Actualiza un evento |
| `PATCH` | `/:eid/status` | ✅ | dueño o `admin` | Cambia el estado (`draft`/`published`/`cancelled`/`finished`) |
| `DELETE` | `/:eid` | ✅ | dueño o `admin` | Elimina un evento |
| `POST` | `/:eid/tickets` | ✅ | cualquiera | Inscribe al usuario autenticado |
| `GET` | `/:eid/tickets` | ✅ | dueño o `admin` | Lista los inscriptos al evento |

**Query params de `GET /api/events`:**

| Param | Tipo | Default | Descripción |
|---|---|---|---|
| `status` | string | — | `draft` \| `published` \| `cancelled` \| `finished` |
| `category` | string | — | Categoría exacta |
| `location` | string | — | Ubicación exacta |
| `dateFrom` | fecha ISO | — | Eventos desde esta fecha |
| `dateTo` | fecha ISO | — | Eventos hasta esta fecha |
| `page` | número | `1` | Página |
| `limit` | número | `10` | Resultados por página |
| `sort` | string | `asc` | Orden por fecha: `asc` \| `desc` |

### Tickets — `/api/tickets`

| Método | Ruta | Auth | Rol | Descripción |
|---|---|---|---|---|
| `GET` | `/my-tickets` | ✅ | — | Tickets propios, con populate de los datos del evento |
| `GET` | `/:tid` | ✅ | dueño o `admin` | Detalle de un ticket |
| `PATCH` | `/:tid/cancel` | ✅ | dueño o `admin` | Cancela el ticket (no lo elimina) |

---

## Ejemplos de uso

Los ejemplos usan `-c/-b cookies.txt` para que curl persista la cookie httpOnly
entre llamadas.

**Formato de respuesta.** Todos los endpoints responden con el mismo sobre:
`status` (`"success"` / `"error"`), un `message` descriptivo, y `payload` con el
recurso ya pasado por su DTO. La única excepción es el listado de eventos, que usa
`data` más los campos de paginación al mismo nivel. Los ejemplos que siguen omiten
el `message` por brevedad.

### Registro

```bash
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Juan","last_name":"Perez","email":"user@test.com","password":"123456"}'
```

```json
{
  "status": "success",
  "payload": {
    "id": "665f1a2b3c4d5e6f7a8b9c0d",
    "first_name": "Juan",
    "last_name": "Perez",
    "email": "user@test.com",
    "role": "user"
  }
}
```

### Login

```bash
curl -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"user@test.com","password":"123456"}'
```

El token viaja en la cookie `authToken` (`httpOnly`). El payload del JWT contiene
únicamente `id`, `email` y `role` — **nunca** la contraseña.

### Usuario actual

```bash
curl http://localhost:8080/api/sessions/current -b cookies.txt
```

### Crear un evento (como `organizer`)

```bash
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Congreso Tech 2026",
    "description": "Charlas sobre backend y arquitectura",
    "category": "tecnologia",
    "date": "2026-12-01T19:00:00.000Z",
    "location": "Buenos Aires",
    "capacity": 100,
    "price": 5000,
    "status": "published"
  }'
```

### Listado paginado

```bash
curl "http://localhost:8080/api/events?status=published&page=2&limit=5"
```

```json
{
  "status": "success",
  "data": [
    { "id": "6690...", "title": "Congreso Tech 2026", "status": "published" }
  ],
  "page": 2,
  "limit": 5,
  "total": 27,
  "totalPages": 6
}
```

### Inscribirse a un evento

```bash
curl -X POST http://localhost:8080/api/events/6690.../tickets \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"quantity": 1}'
```

```json
{
  "status": "success",
  "payload": {
    "id": "66a1...",
    "event": "6690...",
    "user": "665f...",
    "quantity": 1,
    "status": "active",
    "reservationCode": "TCK-7QK2A1B9"
  }
}
```

Si el usuario ya tiene una inscripción activa, o no hay cupo suficiente → **409**:

```json
{ "status": "error", "message": "Ya tenés una inscripción activa a este evento" }
```

### Cancelar un ticket

```bash
curl -X PATCH http://localhost:8080/api/tickets/66a1.../cancel -b cookies.txt
```

El ticket pasa a `status: "cancelled"` y se registra `cancelledAt`. **No se elimina**,
y deja de contar contra el cupo del evento, liberando un lugar.

---

## Flujo de autenticación

1. `POST /api/sessions/register` → la estrategia **`register`** de Passport hashea
   la contraseña con bcrypt (10 salt rounds) y crea el usuario con rol `user`.
2. `POST /api/sessions/login` → la estrategia **`login`** valida las credenciales
   con `bcrypt.compare`. Si son correctas, el controller firma un JWT con
   `{ id, email, role }` y lo envía en la cookie `authToken` (`httpOnly`,
   `sameSite: lax`, `secure` solo en producción).
3. Cada request a una ruta protegida pasa por la estrategia **`current`**
   (`passport-jwt`), que extrae el token **desde la cookie**, lo verifica y carga
   el usuario en `req.user` — siempre sin el campo `password`.
4. `POST /api/sessions/logout` limpia la cookie. A partir de ahí,
   `GET /api/sessions/current` responde **401**.

La autorización se resuelve con dos middlewares encadenados después de Passport:

- `authorizeRoles(...roles)` → **403** si el rol del usuario no está en la lista.
- `authorizeEventOwnerOrAdmin` → **404** si el evento no existe, **403** si el
  usuario no es su organizador ni `admin`.

## Flujo de inscripción

```
POST /api/events/:eid/tickets
        │
        ├── ¿Autenticado?              → no → 401
        ├── ¿quantity > 0?             → no → 400
        ├── ¿El evento existe?         → no → 404
        ├── ¿status === 'published'?   → no → 409
        ├── ¿La fecha es futura?       → no → 409
        ├── ¿Tiene ya un ticket activo?→ sí → 409
        ├── ¿capacity - reservados >= quantity?
        │       (los tickets 'cancelled' no suman)
        │                              → no → 409
        │
        ├── Crea el ticket con reservationCode único
        ├── Envía el email de confirmación (Nodemailer)
        │       ↑ si el envío falla, la inscripción NO se revierte
        │
        └── 201 { status: 'success', payload: TicketDTO }
```

El cupo ocupado se calcula en tiempo real con una agregación que suma el
`quantity` de los tickets en estado `active` del evento. Por eso, cancelar un
ticket libera el lugar automáticamente, sin tocar el documento del evento.

---

## Arquitectura

```
src/
├── config/        # env, conexión a Mongo, Passport, transporter de Nodemailer
├── routes/        # definición de endpoints y encadenado de middlewares
├── controllers/   # coordinan request/response; no contienen lógica de negocio
├── services/      # reglas de negocio y validaciones
├── repository/    # capa de abstracción sobre los DAO
├── dao/           # único lugar donde se importan los modelos de Mongoose
├── models/        # esquemas de Mongoose
├── dto/           # modelan la respuesta pública de cada entidad
├── middlewares/   # autorización por rol, propiedad del recurso y manejo de errores
├── utils.js       # hasheo, generación de códigos y helper createError
└── app.js         # composición de la aplicación
```

**Reglas que respeta el proyecto:**

- Los modelos de Mongoose se importan **solo** en los DAO.
- Los services consumen repositories, nunca DAOs ni modelos.
- Los controllers solo traducen entre HTTP y los services, y delegan los errores
  al middleware centralizado con `next(error)`.
- Toda respuesta de usuario, evento y ticket pasa por su DTO. La contraseña no
  aparece en ninguna respuesta ni en el payload del JWT.

### Manejo de errores

Un middleware centralizado (`middlewares/error.middlewares.js`) captura todos los
errores y responde con un formato uniforme:

```json
{ "status": "error", "message": "Descripción del problema" }
```

Los services lanzan los errores con el helper `createError(mensaje, statusCode)` de
`utils.js`, y los controllers los delegan con `next(error)` sin decidir códigos de
estado por su cuenta. Las rutas inexistentes las captura un handler final que
responde en el mismo formato, de modo que la API **nunca** devuelve HTML.

| Código | Cuándo |
|---|---|
| `400` | Datos inválidos (fecha pasada, `capacity <= 0`, `price < 0`) |
| `401` | Sin token, token inválido o expirado |
| `403` | Rol insuficiente o no es dueño del recurso |
| `404` | Evento, ticket o ruta inexistente |
| `409` | Inscripción duplicada, sin cupo, evento no publicado o cancelado |
| `500` | Error inesperado del servidor |

---

## Verificación del flujo completo

Casos recorridos de punta a punta antes de la entrega:

| # | Caso | Resultado esperado |
|---|---|---|
| 1 | Registro → login → `/current` → logout → `/current` | `201` → `200` → `200` → `200` → **`401`** |
| 2 | `user` intenta crear un evento | **`403`** |
| 3 | `organizer` crea evento → `user` se inscribe | `201` + email recibido + cupo descontado |
| 4 | `user` se inscribe de nuevo al mismo evento | **`409`** inscripción duplicada |
| 5 | `user` se inscribe a un evento sin cupo | **`409`** sin cupo disponible |
| 6 | `user` cancela su ticket → se inscribe otro usuario | `200` → cupo liberado → `201` |
| 7 | `organizer` intenta modificar un evento ajeno | **`403`** |
| 8 | `admin` modifica el evento de otro organizador | **`200`** |
| 9 | Respuestas de usuario, evento y ticket | ningún campo `password` |
| 10 | `GET /api/events?status=published&page=2&limit=5` | estructura paginada completa |

---

## Autor

Juan Lorenzo ([@Juanrar](https://github.com/Juanrar)) — Curso de Backend, CoderHouse.
