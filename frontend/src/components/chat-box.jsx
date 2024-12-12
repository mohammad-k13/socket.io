import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";

const ChatBox = () => {
    const [messages, setMessages] = useState([
        {
            id: new Date(),
            text: "Hello How Can I Help you?",
            author: "bot",
        },
    ]);
    const [newMessage, setNewMessage] = useState("");
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
            setMessages((prev) => [...prev, { id: new Date(), text: newMessage, author: "user" }]);
            setNewMessage("");

            setTimeout(() => {
                setMessages((prev) => [...prev, { id: new Date(), text: "hellow", author: "bot" }]);
            }, 500);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <article className="w-[400px] h-[650px] rounded-md overflow-hidden bg-white shadow-lg relative p-4 px-2">
            <header className="w-full flex items-center justify-center  flex-col pb-4">
                <h1 className="text-xl font-bold">Wellcome to IChatBox</h1>
                <p>start a conversation to each other</p>
            </header>
            <main className="flex flex-col gap-1 h-[500px] overflow-y-auto mb-5">
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
                <form className="w-full p-3 flex items-center gap-4">
                    <Input
                        name="new-message"
                        value={newMessage}
                        onChange={(event) => newMessageChangeHandler(event.target.value)}
                        placeholder="Send a message"
                        className="p-3"
                    />
                    <Button onClick={addNewMessageHandler}>Send</Button>
                </form>
            </footer>
        </article>
    );
};

export default ChatBox;
