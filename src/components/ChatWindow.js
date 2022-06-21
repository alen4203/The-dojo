import { useEffect, useState } from "react";
import { useFirestore } from "../hooks/useFirestore";
import { useMessages } from "../hooks/useMessages";
import { useAuthContext } from "../hooks/useAuthContext";
import { format, isToday, isYesterday } from "date-fns";
import Avatar from "./Avatar";

export default function ChatWindow({
  chatWith,
  closeChatWindow,
  minimizeWindow,
}) {
  const [message, setMessage] = useState("");
  const { user } = useAuthContext();
  const { response, addDocument } = useFirestore("messages");
  const { error, documentsAll } = useMessages(user.uid, chatWith.id);

  const messagesContainer = document.querySelector(".chat-messages");

  const sameDay = function (date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleSubmit = function (e) {
    e.preventDefault();
    const messageContent = {
      from: user.uid,
      to: chatWith.id,
      content: message,
    };
    addDocument(messageContent);
    setMessage("");
  };

  useEffect(() => {
    if (messagesContainer)
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [documentsAll]);

  return (
    <div className="chat-window">
      <div className="chat-title">
        <Avatar src={chatWith.photoURL} />
        <span className="chat-partner">
          <p>{chatWith.displayName}</p>
          {chatWith.online && <span className="online-user"></span>}
        </span>
        <button onClick={() => minimizeWindow(chatWith)}>&minus;</button>
        <button onClick={() => closeChatWindow(chatWith)}>&times;</button>
      </div>
      <div className="chat-messages">
        {error && <p class="fetch-message-error">{error}</p>}
        {documentsAll &&
          documentsAll.map((doc, i, docs) => (
            <div key={doc.id}>
              {(i === 0 ||
                (i > 0 &&
                  !sameDay(
                    docs[i - 1].createdAt.toDate(),
                    doc.createdAt.toDate()
                  ))) && (
                <p className="message-date">
                  {isToday(doc.createdAt.toDate())
                    ? "Today"
                    : isYesterday(doc.createdAt.toDate())
                    ? "Yesterday"
                    : format(doc.createdAt.toDate(), "yy-MMM-dd")}
                </p>
              )}
              <div
                className={
                  doc.from === user.uid
                    ? "chat-message chat-message-send"
                    : "chat-message chat-message-receive"
                }
              >
                <p>{doc.content}</p>
                <p className="message-time">
                  {format(doc.createdAt.toDate(), "HH:mm")}
                </p>
              </div>
            </div>
          ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={
            response.isPending ? "sending message..." : "say something..."
          }
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </form>
    </div>
  );
}
