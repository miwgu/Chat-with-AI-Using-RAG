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

    <div className="border-t border-gray-300 bg-white p-3">
        <form 
              onSubmit={handleSubmit} 
              className="flex flex-col border border-gray-300 rounded-md resize-none items-end gap-2" >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            rows={1}
            className="w-full p-3  text-gray-900  rounded-md resize-none overflow-y-auto min-h-[60px] max-h-[200px] focus:outline-none focus:ring-0 focus:border-transparent"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="self-end bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-1.5 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed m-2"
            /* className={loading || !message.trim() ? "disabled" : ""} */
          >
            Send
          </button>
        </form>
      </div>
  )
}

export default ChatInput