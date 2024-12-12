import { Server } from "socket.io";

const io = new Server(3000, { cors: "*" });

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.broadcast.emit("hello", "world");

  socket.on("send-message", ({ message, senderId }, room) => {
    console.log(senderId);
    console.log(socket.id)
    const payload = { message, senderId};
    if (!room) {
      socket.broadcast.emit("recive-message", payload);
    } else {
      socket.to(room).emit("recive-message", payload);
    }
  });
});