import "./Chat.css";

interface Props {
 message: string;
 setMessage: (msg:string) => void;
 loading: boolean;
 sendMessage: () =>void;
}

const ChatInput: React.FC<Props> = ({ message, setMessage, loading, sendMessage }) => {

const handleSubmit = (e: React.FormEvent) => {
       e.preventDefault();
       sendMessage();
     };

  return (
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
  )
}

export default ChatInput