import { Server } from "socket.io";

const io = new Server(3000, { cors: {origin: ['http://localhost:5173']} });

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("send-message", ({ message, senderId }, room) => {

        const payload = { message };
        if (!room) {
            socket.broadcast.emit("recive-message", payload);
        } else {
            socket.to(room).emit("recive-message", payload);
        }
    });

    socket.on("join-room", (roomId, cb) => {
        socket.join(roomId);
        cb("Joined " + roomId);
    });
});
