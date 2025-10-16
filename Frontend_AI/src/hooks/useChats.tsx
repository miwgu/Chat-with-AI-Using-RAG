import { useEffect, useRef, useState } from "react";
import { ChatEntry, fetchChatLog, streamQuery } from "../api/chatApi";

export const useChat = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const loadChatLog = async () => {
    try {
      const data = await fetchChatLog();
      const sorted = data.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setChatLog(sorted);
    } catch (err: any) {
      setError("Failed to fetch chat log");
    }
  };

  // Load chat history on component mount
  useEffect(() => {
    loadChatLog();
  }, []);

  // Maintain chat scroll position
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");
    setLoading(true);

    /* 
     Immediate on-screen display using a temporary ID and temporary creation time
     so that the user can see their question while the response is being generated
    */
   const tempId = Date.now();
    const tempEntry: ChatEntry = {
      id: tempId,
      question: userMessage,
      response: "",
      created_at: new Date().toISOString(),
    };
    setChatLog((prev) => [...prev, tempEntry]);
    
    /**
     * streamQuery
     * prev=[
     * {id:1, question: "Hello", response: "Hi!"},   // entry 1
     * {id:1749940215123, question: "What is your name?", response: ""}]//emtry 2 send question now
     * Set newest setChatLog((prev) => [...prev, tempEntry]);
     */

    try {
        await streamQuery(userMessage, (chunk)=>{
        setChatLog((prev) => { //prev already includes the newest question in the chat log
          return prev.map((entry)=>
            entry.id === tempId //Date.now()
          // Copy the previous entry and update only the response with the new chunk
          ? { ...entry, response: (entry.response || "") +chunk}
          : entry
          );
        });   
      }); 
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
      await loadChatLog();
    }
  };

  return {
    message,
    setMessage,
    chatLog,
    loading,
    error,
    chatEndRef,
    sendMessage,
  };
};

export default useChat;
