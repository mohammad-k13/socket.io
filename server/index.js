import { Server } from "socket.io";

const io = new Server(3000, {cors: "*"})

io.on("connection", socket => {
  console.log("a user connnected", socket.id)

  socket.on("send-message", ({message}) => {
    console.log(message);
    io.emit("recive-message", {message: "hellow from me"})
    socket.broadcast.emit("recive-message", {message: "hellow from me"})
  })
})