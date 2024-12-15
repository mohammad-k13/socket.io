import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const io = new Server(3000, { cors: { origin: ["http://localhost:5173"] } });
const userRooms = new Map();

io.on("connection", (socket) => {
  socket.data.userId = null;

  socket.on("assign-user-id", (userId) => {
    socket.data.userId = userId;
    if (userRooms.has(userId)) {
      const rooms = userRooms.get(userId);
      rooms.forEach((roomId) => {
        socket.join(roomId);
        console.log(`Rejoined user ${userId} to room ${roomId}`);
      });
    }
  });

  socket.on("join-room", (roomId, cb) => {
    const userId = socket.data.userId;
    if (!userId) return cb("User ID not assigned.");

    socket.join(roomId);

    if (!userRooms.has(userId)) {
      userRooms.set(userId, new Set());
    }
    userRooms.get(userId).add(roomId);

    cb(`Joined room ${roomId}`);
  });

socket.on("send-message", ({ message }, room) => {
  const userId = socket.data.userId;
  if (!userId) return;

  const payload = { message, senderId: userId };

  if (message && message.toString().trim() !== "") {
    if (!userRooms.has(userId) || !userRooms.get(userId).has(room)) {
      socket.broadcast.emit("recive-message", payload);
    } else {
      socket.to(room).emit("recive-message", payload);
    }
  }
});

  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    if (!userId) return;

    if (userRooms.has(userId)) {
      const rooms = userRooms.get(userId);
      rooms.forEach((roomId) => {
        socket.to(roomId).emit("user-disconnected", `${userId} has left the room`);
      });
    }
  });

  socket.on("disconnecting", () => {
    const userId = socket.data.userId;
    if (!userId) return;

    const rooms = [...socket.rooms].filter((r) => r !== socket.id);
    userRooms.set(userId, new Set(rooms));
    console.log(`Saving rooms for user ${userId}:`, rooms);
  });
});
