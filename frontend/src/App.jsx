import { io } from "socket.io-client"
import ChatBox from "./components/chat-box";

export default function App() {
  return (
    <section className="w-full h-dvh bg-green-100 flex items-center justify-center">
      <ChatBox />
    </section>
  )
}