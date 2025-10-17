import { useChat } from "../hooks/useChats";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";


const Chat = () => {
  const chat = useChat();
  
  return (
    <>
      <div className="fixed inset-0 bg-[url('/images/flower-1469664.jpg')] bg-cover bg-center opacity-50 -z-10 pointer-events-none"></div>
      <div className="max-w-3xl mx-auto h-[75vh] flex flex-col border border-gray-300 rounded-xl p-4 bg-white shadow-md">
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

        {chat.error && <p className="text-red-500 text-sm mt-2">⚠️ {chat.error}</p>}
      </div>
      <footer className="inline-block text-xs text-white bg-black/40 backdrop-blur-md rounded-xl mt-4 py-2 px-6 shadow">© AI Chat 2025</footer>
    </>
  );
};

export default Chat;