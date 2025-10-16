import { ChatEntry } from "../api/chatApi";
import { useChat } from "../hooks/useChats";
import "./Chat.css";
import TypingAnimation from "./TypingAnimation";

const Chat = () => {
  const {
    message,
    setMessage,
    chatLog,
    loading,
    error,
    chatEndRef,
    sendMessage,
  } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };


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
    <>
      <div className="background-image-layer"></div>
      <div className="chat-container">
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

        <form className="chat-input" onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            rows={1}
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            /* className={loading || !message.trim() ? "disabled" : ""} */
          >
            Send
          </button>
        </form>

        {error && <p className="error">⚠️ {error}</p>}
      </div>
      <footer className="chat-footer">© AI Chat 2025</footer>
    </>
  );
};

export default Chat;
