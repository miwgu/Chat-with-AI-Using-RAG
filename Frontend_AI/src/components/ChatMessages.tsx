import { ChatEntry } from "../api/chatApi";
import TypingAnimation from "./TypingAnimation";
import React from "react";

interface Props {
  chatLog: ChatEntry[];
  loading: boolean,
  chatEndRef: React.RefObject<HTMLDivElement>
}
const ChatMessages: React.FC<Props>  = ({ chatLog, loading, chatEndRef }) => {

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
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 rounded-md">
          {chatLog.length === 0 ? (
            <div className="text-center text-gray-400 italic mt-10">
              There is no chat history. Please enter a question.
            </div>
          ) : (
            chatLog.map((entry, idx) => {
              return (
                <div key={entry.id}>
                  <div className="break-words whitespace-pre-wrap bg-indigo-100 text-gray-800 p-3 rounded-lg my-2 ml-auto max-w-[60%] text-left">
                    {entry.question}
                  </div>
                  <div className="break-words whitespace-pre-wrap bg-gray-100 text-gray-800 p-3 rounded-lg my-2 mr-auto max-w-[90%] text-left">
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