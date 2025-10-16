import { useChat } from "../hooks/useChats";
import { ChatEntry } from "../api/chatApi";
import TypingAnimation from "./TypingAnimation";
import "./Chat.css";

const ChatMessages = () => {
      const {
        chatLog,
        loading,
        chatEndRef,
      } = useChat();
    
 /**
   * Check if this entry should show typing animation
   * @param idx - The index of the entry in the chat log
   * @param entry - The chat entry object containing question and response
   * @returns True if this entry is the latest question and AI is still responding
   * 
   * loading === true → AI is currently sending a response
   * idx === chatLog.length - 1 → This is the latest question (the last entry)
   * entry.response === "" → The response is still empty
   */
  const isLoadingEntry =(idx: number, entry:ChatEntry): boolean =>
    loading && idx === chatLog.length - 1 && entry.response === "";


  return (
    <div className="chat-messages">
          {chatLog.length === 0 ? (
            <div className="empty-message">
              There is no chat history. Please enter a question.
            </div>
          ) : (
            chatLog.map((entry, idx) => {
              return (
                <div key={entry.id}>
                  <div className="message user">{entry.question}</div>
                  <div className="message ai">
                    {isLoadingEntry(idx, entry) ? <TypingAnimation /> : entry.response}
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>
  )
}

export default ChatMessages