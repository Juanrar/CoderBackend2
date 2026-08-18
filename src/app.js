import express from 'express'
import { connectDB } from './config/database.js'
import { env } from './config/env.js'
import usersRouter from './routes/user.routes.js'
import sessionsRouter from './routes/session.routes.js'
import eventsRouter from './routes/event.routes.js'
import ticketsRouter from './routes/ticket.routes.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', usersRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/events', eventsRouter)
app.use('/api/tickets', ticketsRouter)

app.listen(env.PORT, () => {
    connectDB()
    console.log(`Servidor escuchando en el puerto ${env.PORT}`)
})
