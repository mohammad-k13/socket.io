import { io } from "socket.io-client"

export default function App() {
  const socket = io("http://localhost:3000");
  console.log(socket);

  socket.on("connect", () => {
    alert(`SOCKET CONNECT ${socket.id}`)
  })

  return (
    <section className="w-full h-dvh bg-green-100 flex items-center justify-center"></section>
  )
}