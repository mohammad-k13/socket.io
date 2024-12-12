import { Server } from "socket.io";

const io = new Server(3000, { cors: "*" });

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("send-message", ({ message }, room) => {
    const payload = { message, senderId: socket.id };
    if (room) {
      socket.to(room).emit("recive-message", payload);
    } else {
      socket.broadcast.emit("recive-message", payload);
    }
  });
});