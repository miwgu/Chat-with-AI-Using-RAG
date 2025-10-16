import { useChat } from "../hooks/useChats";
import "./Chat.css";
import ChatMessages from "./ChatMessages";


const Chat = () => {
  const {
    message,
    setMessage,
    loading,
    error,
    sendMessage,
  } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };
  
  return (
    <>
      <div className="background-image-layer"></div>
      <div className="chat-container">
        <ChatMessages />
         {/* <div className="chat-messages">
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
        </div> */}

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
