import { Server } from 'socket.io'
import  App  from  'express'
const io = new Server()
const app = new App()
io.attachApp(app)
io.on("connection", (socket) => {
    console.log("this is test message")
})

app.listen(300, (token) => {
    if (!token) {
        console.warn("the port is already in use")
    }
})