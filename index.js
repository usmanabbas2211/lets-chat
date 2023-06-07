require('colors')
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')
const app = express()
const server = http.createServer(app)
const { faker } = require('@faker-js/faker')
const { Server } = require('socket.io')
const io = new Server(server, { origins: '*:*' })
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

const connectedUsers = new Map()

io.on('connection', (socket) => {
    connectedUsers.set(socket.id, {
        id: socket.id,
        name: faker.internet.userName(),
        img: faker.image.avatar(),
        time: new Date().toDateString(),
    })
    io.emit('connectedUsers', Array.from(connectedUsers.values()))
    socket.on('join', (roomId) => {
        socket.join(roomId)
    })

    socket.on('message', (roomId, message) => {
        io.to(roomId).emit('message', message, roomId)
    })

    socket.join('room', () => {})

    socket.on('disconnect', (reason) => {
        connectedUsers.delete(socket.id)
        io.emit('connectedUsers', Array.from(connectedUsers.keys()))
    })

    // socket.on('message', (arg) => {
    //     console.log(arg, 'from', socket.id) // world
    //     socket.broadcast.emit('got-message', arg)
    // })
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
