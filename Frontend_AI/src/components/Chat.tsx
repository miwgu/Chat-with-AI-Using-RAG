import { useChat } from "../hooks/useChats";
import "./Chat.css";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";


const Chat = () => {
  const chat = useChat();
  
  return (
    <>
      <div className="background-image-layer"></div>
      <div className="chat-container">
        <ChatMessages
         chatLog={chat.chatLog}
         loading={chat.loading}
         chatEndRef ={chat.chatEndRef}
         />

        <ChatInput
         message={chat.message}
         setMessage={chat.setMessage}
         loading={chat.loading}
         sendMessage={chat.sendMessage}
        />

        {chat.error && <p className="error">⚠️ {chat.error}</p>}
      </div>
      <footer className="chat-footer">© AI Chat 2025</footer>
    </>
  );
};

export default Chat;
