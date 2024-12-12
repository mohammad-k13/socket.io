import { io } from "socket.io-client"
import ChatBox from "./components/chat-box";

export default function App() {
  // const socket = io("http://localhost:3000");
  // console.log(socket);

  // socket.on("connect", () => {
  //   socket.emit("send-message", {message: "hellow"});
  //   socket.on("recive-message", ({message}) => {
  //     console.log(message);
  //   })
  // })

  return (
    <section className="w-full h-dvh bg-green-100 flex items-center justify-center">
      <ChatBox />
    </section>
  )
}