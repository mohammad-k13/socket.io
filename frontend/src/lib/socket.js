import { io } from "socket.io-client";

let socket;
try {
  socket = io("http://localhost:3000", {
    autoConnect: true,
  });
} catch (err) {
  alert("hav error");
  console.log(err);
}
export default socket;
