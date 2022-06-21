import { useEffect, useState } from "react";
import { useCollection } from "../hooks/useCollection";
import ChatWindow from "./ChatWindow";

// styles
import "./ChatBox.css";
import ChatIcon from "../assets/chat_icon.svg";
import Avatar from "./Avatar";

export default function ChatBox() {
  const [openSearchWindow, setOpenSearchWindow] = useState(false);
  // user search input
  const [sendTo, setSendTo] = useState("");
  // user filter list
  const [possibleUsers, setPossibleUsers] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [minimized, setMinimized] = useState([]);
  // fetch all users
  const { documents, error } = useCollection("users");

  // Add new user to chat message receivers (open chat window).
  const openChatWindow = function (user) {
    if (receivers.length === 2) {
      const firstRec = receivers[0];
      setMinimized((minimized) => [...minimized, firstRec]);
      setReceivers((receivers) => receivers.slice(1));
    }
    setReceivers((prevReceivers) => [...prevReceivers, user]);
    setSendTo("");
  };

  // for ChatWindow component to close window
  const closeChatWindow = function (user) {
    setReceivers((prevReceivers) => {
      return prevReceivers.filter((rec) => rec.id !== user.id);
    });
    if (minimized.length > 0) {
      const lastMin = minimized.at(-1);
      setMinimized((minimized) => minimized.slice(0, -1));
      setReceivers((prevReceivers) => [...prevReceivers, lastMin]);
    }
  };

  // if only one user filtered, auto open that user's chat window
  const handleSubmit = function (e) {
    e.preventDefault();
    if (
      possibleUsers.length === 1 &&
      !receivers.find((rec) => rec.id === possibleUsers[0].id)
    ) {
      if (minimized.some((m) => m.id === possibleUsers[0].id)) {
        setMinimized((minimized) =>
          minimized.filter((m) => m.id !== possibleUsers[0].id)
        );
      }
      openChatWindow(possibleUsers[0]);
    }
  };

  // Get the clicked user, if chat window not opened, open it.
  const handleClick = function (e) {
    const userEl = e.target.closest(".possible-user");
    if (!userEl) return;
    const userId = userEl.dataset.id;
    const user = documents.find((doc) => doc.id === userId);
    if (!receivers.find((rec) => rec.id === userId)) {
      if (minimized.some((m) => m.id === userId)) {
        setMinimized((minimized) => minimized.filter((m) => m.id !== userId));
      }
      openChatWindow(user);
    }
  };

  // from chat window to minimized
  const handleMinimize = function (user) {
    setReceivers((prevReceivers) =>
      prevReceivers.filter((rec) => rec.id !== user.id)
    );
    setMinimized((minimized) => [...minimized, user]);
  };

  // from minimized to chat window
  const reverseMinimize = function (e) {
    const userEl = e.target.closest("span");
    if (!userEl) return;

    const userId = userEl.dataset.id;
    const user = documents.find((doc) => doc.id === userId);

    setMinimized((minimized) => minimized.filter((m) => m.id !== userId));
    openChatWindow(user);
  };

  // show filtered users for selection
  useEffect(() => {
    if (sendTo.length > 0) {
      let results = [];
      documents.forEach((doc) => {
        if (doc.displayName.includes(sendTo)) results.push(doc);
      });
      setPossibleUsers(results);
    }
    if (sendTo.length === 0) {
      setPossibleUsers([]);
    }
  }, [sendTo, documents]);

  // update realtime receivers
  useEffect(() => {
    setReceivers((prevReceivers) => {
      return documents.filter((doc) => {
        return prevReceivers.some((rec) => doc.id === rec.id);
      });
    });
  }, [documents]);

  return (
    <div className="chatbox">
      <div
        className="chat-button"
        onClick={() => setOpenSearchWindow(!openSearchWindow)}
      >
        <img src={ChatIcon} />
      </div>
      <div
        className="chat-search"
        style={{ display: openSearchWindow ? "block" : "none" }}
      >
        {minimized.length > 0 && (
          <div className="minimized-users" onClick={reverseMinimize}>
            {minimized.map((user) => (
              <span key={user.id} data-id={user.id}>
                <Avatar src={user.photoURL} />
              </span>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            className="query-input"
            type="text"
            placeholder="send message to:"
            onChange={(e) => setSendTo(e.target.value)}
            value={sendTo}
          />
        </form>
        {error && <p className="error">{error}</p>}
        {possibleUsers.length > 0 && (
          <div className="possible-users" onClick={handleClick}>
            {possibleUsers.map((doc) => (
              <div key={doc.id} className="possible-user" data-id={doc.id}>
                <Avatar src={doc.photoURL} />
                <p>{doc.displayName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {receivers.length > 0 &&
        receivers.map((receiver) => (
          <ChatWindow
            key={receiver.id}
            chatWith={receiver}
            closeChatWindow={closeChatWindow}
            minimizeWindow={handleMinimize}
          />
        ))}
    </div>
  );
}
