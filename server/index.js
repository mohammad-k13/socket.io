import { Server } from "socket.io";

const io = new Server(3000, {cors: "*"})

io.on("connection", socket => {
  console.log("a user connnected", socket.id)
})