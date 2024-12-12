import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 } from "uuid";

const ChatBox = () => {
    const socket = io("http://localhost:3000");

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
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };
    const newMessageChangeHandler = (message) => setNewMessage(message);
    const addNewMessageHandler = (e) => {
        e.preventDefault();

        if (newMessage) {
            setMessages((pv) => [...pv, { id: v4(), text: newMessage, author: "user" }]);
            socket.emit("send-message", { message: newMessage, senderId: socketId }, roomId);
            setNewMessage("");
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        socket.on("connect", () => {
            setSocketId(socket.id);
            socket.on("recive-message", ({ message, senderId }) => {
              console.log("senderId " + senderId);
              console.log("socket.id ", socket.id)
              console.log("socketId", socketId)
              if(senderId !== socket.id) {
                setMessages((prev) => [...prev, { id: v4(), text: message, author: "bot" }]);
              }
            });
        });


        return () => {
            socket.disconnect();
            socket.on("disconnected", () => {
                console.log("disconnected from socket");
            });
        };
    }, []);

    return (
        <article
            className="w-[500px] h-[650px] border-[1px] border-black rounded-md overflow-hidden bg-white shadow-lg relative p-4 px-2"
            key={socketId}
        >
            <header className="w-full flex items-center justify-center  flex-col pb-4">
                <h1 className="text-xl font-bold">Wellcome to IChatBox </h1>
                <p>{socketId || ""}</p>
            </header>
            <div className="w-[90%] h-[1px] bg-gray-200 mx-auto mt-2 mb-5"></div>
            <main className="flex flex-col gap-1 h-[400px] overflow-y-auto mb-5" ref={chatContainerRef}>
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 50, scale: 0.5 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${message.author === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`w-fit py-2 px-3 rounded-md text-wrap max-w-[70%] overflow-hidden ${
                                    message.author === "user" ? "bg-blue-500 text-white" : "bg-gray-300/80 text-black"
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
                            placeholder="enter room id"
                            className="p-3"
                        />
                        <Button onClick={addNewMessageHandler}>Send Room Id</Button>
                    </div>
                </form>
            </footer>
        </article>
    );
};

export default ChatBox;
