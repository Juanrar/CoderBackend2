import express from 'express'
import { connectDB } from './config/database.js'
import { env } from './config/env.js'
import sessionsRouter from './routes/session.routes.js'
import eventsRouter from './routes/event.routes.js'
import ticketsRouter from './routes/ticket.routes.js'
import cookieParser from 'cookie-parser'
import {initializePassport} from './config/passport.js'
import { errorHandler } from './middlewares/error.middlewares.js'


const app = express()

initializePassport()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/sessions', sessionsRouter)
app.use('/api/events', eventsRouter)
app.use('/api/tickets', ticketsRouter)

app.use((req, res, next) => {
    next(createError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404))
})

app.use(errorHandler)

await connectDB();
app.listen(env.PORT, () => console.log(`Servidor escuchando en el puerto ${env.PORT}`));
