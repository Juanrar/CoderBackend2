import express from 'express'
import { connectDB } from './config/database.js'
import { env } from './config/env.js'
//import usersRouter from './routes/users.routes.js'
//import sessionsRouter from './routes/sessions.routes.js'
//import eventsRouter from './routes/events.routes.js'
//import ticketsRouter from './routes/tickets.routes.js'

const app = express()

app.use(express.json())

//app.use('/api/users', usersRouter)
//app.use('/api/sessions', sessionsRouter)
//app.use('/api/events', eventsRouter)
//app.use('/api/tickets', ticketsRouter)

app.listen(env.PORT, () => {
    connectDB()
    console.log(`Servidor escuchando en el puerto ${env.PORT}`)
})
