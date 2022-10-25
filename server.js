require('colors')
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
const app = express()
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
    },
})
//routes

const { server_error } = require('./helpers/responseHelper')
const connectMongo = require('./utils/connectMongo')

app.use(morgan('combined'))
app.use(express.json())
app.use(cookieParser())

app.use(
    cors({
        origin: '*',
    })
)

connectMongo()

app.get('/', (req, res) => {
    res.send('this is success')
})
io.on('connection', (socket) => {
    console.log('a user connected', socket.id)
    socket.join('room', () => {
        console.log('joined class room')
    })

    socket.on('disconnect', (reason) => {
        console.log(reason)
    })
    socket.on('message', (arg) => {
        console.log(arg) // world
        socket.broadcast.emit('got-message', arg)
    })
})

// setInterval(() => {
//     io.to('clock-room').emit('time', new Date())
// }, 1000)

app.use(function (err, req, res, next) {
    console.log('err=>', err)
    return server_error(res, 'something went wrong')
})

server.listen(process.env.PORT, () =>
    console.log(`server is listening on port ${process.env.PORT}`.bgCyan)
)
