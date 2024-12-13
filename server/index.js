import { Server } from "socket.io";

const io = new Server(3000, { cors: "*" });

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("send-message", ({ message, senderId }, room) => {
    const roomInfo = io.sockets.adapter.rooms.get(room);
    const members = Array.from(roomInfo);
    console.log(members)


    const payload = { message, senderId};
    if (!room) {
      socket.broadcast.emit("recive-message", payload);
    } else {
      socket.to(room).emit("recive-message", payload);
    }
  });

  socket.on("join-room", (roomId, cb) => {
    socket.join(roomId);
    cb('Joined ' + roomId)
  })
});