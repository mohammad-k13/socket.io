import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 } from "uuid";
import { toast } from "sonner";

const socket = io("http://localhost:3000");

const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      id: v4(),
      text: "Hello How Can I Help you?",
      author: "bot",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isDisconnected, setDisconnected] = useState();
  const [userId, setUserId] = useState("");
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const newMessageChangeHandler = (message) => setNewMessage(message);

  const addNewMessageHandler = (e) => {
    e.preventDefault();

    if (isDisconnected) {
      toast.error("you are disconnected, can't send message");
      return;
    }

    if (newMessage.trim() !== "") {
      setMessages((prev) => [...prev, { id: v4(), text: newMessage, author: "user" }]);

      socket.emit("send-message", { message: newMessage, senderId: socketId }, roomId, (error) => {
        console.log(error);
        if (error) {
          alert("Message failed to send. Please try again.");
        }
      });

      setNewMessage("");
    }
  };

  const joinToRoom = (e) => {
    e.preventDefault();

    socket.emit("join-room", roomId, (message) => {
      setMessages((prev) => [...prev, { id: v4(), text: message, author: "message" }]);
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleReceiveMessage = ({ message, senderId }) => {
      setMessages((prev) => [...prev, { id: v4(), text: message, author: "bot" }]);
    };

    socket.on("recive-message", handleReceiveMessage);

    return () => {
      socket.off("recive-message", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      toast.success("Connected to server");
      setDisconnected(false);
      socket.emit("assign-user-id", userId);
    };

    const handleReconnect = () => {
      toast.success("Reconnected to server");
      socket.emit("assign-user-id", userId);
    };

    socket.on("connect", handleConnect);
    socket.on("reconnect", handleReconnect);

    socket.on("disconnect", () => {
      toast.error("Disconnected from server");
      setDisconnected(true);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("reconnect", handleReconnect);
      socket.off("disconnect");
    };
  }, [userId]);

  //
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "c") socket.connect();
      if (e.key === "d") socket.disconnect();
    });

    socket.on("user-disconnected", (message) => {
      setMessages((prev) => [...prev, { id: v4(), text: message, author: "message" }]);
    });

    const id = v4();
    setUserId(id);
    socket.emit("assign-user-id", id);
  }, []);

  return (
    <article
      className="w-[500px] h-[650px] border-[1px] border-black rounded-md overflow-hidden bg-white shadow-lg relative p-4 px-2"
      key={socketId}
    >
      <header className="w-full flex items-center justify-center  flex-col pb-4">
        <h1 className="text-xl font-bold">Welcome to IChatBox </h1>
        <p>{userId || ""}</p>
      </header>
      <div className="w-[90%] h-[1px] bg-gray-200 mx-auto mt-2 mb-5"></div>
      <main className="flex flex-col gap-1 h-[400px] overflow-y-auto mb-5" ref={chatContainerRef}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 50, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${
                message.author === "user"
                  ? "justify-end"
                  : message.author === "bot"
                  ? "justify-start"
                  : "justify-center"
              }`}
            >
              <div
                className={`w-fit py-2 px-3 rounded-md text-wrap max-w-[70%] overflow-hidden ${
                  message.author === "user"
                    ? "bg-blue-500 text-white"
                    : message.author === "bot"
                    ? "bg-gray-300/80 text-black"
                    : "bg-blue-100 text-blue-500 text-xs  rounded-full !px-7 py-1 my-2"
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>
      <footer className="bg-white/50 w-full h-fit backdrop-blur-sm absolute left-1/2 bottom-0 -translate-x-1/2 ">
        <form className="w-full p-3 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Input
              name="new-message"
              value={newMessage}
              onChange={(event) => newMessageChangeHandler(event.target.value)}
              placeholder="Send a message"
              className="p-3"
            />
            <Button onClick={addNewMessageHandler}>Send Message</Button>
          </div>
          <div className="flex items-center gap-4">
            <Input
              name="room"
              value={roomId}
              onChange={(event) => setRoomId(event.target.value)}
              placeholder="Enter room ID"
              className="p-3"
            />
            <Button onClick={joinToRoom}>Join Room</Button>
          </div>
          {/* <Button>Leave Rome</Button> */}
        </form>
      </footer>
    </article>
  );
};

export default ChatBox;
