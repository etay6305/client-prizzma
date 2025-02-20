// import React, { useState, useEffect } from "react";
// import { Socket } from "socket.io-client";


// // הגדרת סוגי פרמטרים
// interface ChatProps {
//   socket: Socket; // טיפוס מוגדר עבור ה-socket
//   username: string;
//   room: string;
// }

// // הגדרת טיפוס להודעה
// interface Message {
//     room: string;
//     author: string;
//     message: string;
//     time: string;
//   }

// const ChatPlus: React.FC<ChatProps> = ({ socket, username, room }) => {
//     const [currentMessage, setCurrentMessage] = useState<string>("");
//     const [messageList, setMessageList] = useState<Message[]>([]);
//     const sendMessage = async () => {
//         if (currentMessage !== "") {
//             const messageData = {
//                 room: room,
//                 author: username,
//                 message: currentMessage,
//                 time: new Date(Date.now()).getHours() + ":" 
//                 + 
//                 new Date(Date.now()).getMinutes(),

//             }
//             await socket.emit("send_message", messageData);
//             setMessageList((list) => [...list, messageData]);
//         }
//     };

//     useEffect(() => {
//         socket.on("receive_message", (data) => {
//             setMessageList((list) => [...list, data]);
//         })
//     }, [socket])
//   return (
//     <div className="chat-container">
//         <div className="chat-header">
//         <div className="status-bar">9:41 AM</div>
//         <div className="title">Live Chat</div>
//         <div className="status-bar">🔋 100%</div>

//          {/* חריץ מצלמה ורמקול */}
//          <div className="iphone-notch">
//                 <div className="iphone-speaker"></div>
//                 <div className="iphone-camera"></div>
//             </div>
//     </div>
//       <div className="chat-header">
//         <p>Live Chat</p>
//       </div>
//       <div className="chat-body">
//             <div className="message received">
//                 <p>Hey, welcome to the chat!</p>
//                 <p className="time">9:45 AM</p>
//             </div>
//             <div className="message sent">
//                 <p>Thanks! Excited to be here 🚀</p>
//                 <p className="time">9:46 AM</p>
//             </div>
//             <div className="message received">
//                 {messageList.map((messageContent: any) => {
//                     return <h1>{messageContent.message}</h1>
//                 })}
//             </div>        
//       </div>
//       <div className="chat-footer">
//         <input type="text" 
//          placeholder="Hey..."
//          onChange={(e) => {setCurrentMessage(e.target.value)}}/>
//         <button onClick={sendMessage}>&#9658;</button>
//       </div>
//       {/* <div className="iphone-home-button"></div> */}
//     </div>
//   );
// };

// export default ChatPlus;



import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

const audio = new Audio("/zapsplat_multimedia_ui_short_notification_click_pop_up_new_message_etc_001_38606.mp3");

// הגדרת סוגי פרמטרים
interface ChatProps {
  socket: Socket; // טיפוס מוגדר עבור ה-socket
  username: string;
  room: string;
}

// הגדרת טיפוס להודעה
interface Message {
  room: string;
  author: string;
  message: string;
  time: string;
}

const ChatPlus: React.FC<ChatProps> = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState<string>(""); // הודעה נוכחית
  const [messageList, setMessageList] = useState<Message[]>([]); // רשימת הודעות

  // שליחת הודעה
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData: Message = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      // שליחה לשרת
      await socket.emit("send_message", messageData);

      // עדכון הרשימה באופן מקומי (רק במשלוח הודעות שלי)
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage(""); // ריקון שדה ההודעה לאחר שליחה
    }
  };

  // קבלת הודעות
  useEffect(() => {
    const handleReceiveMessage = (data: Message) => {
      // הוספת הודעה חדשה
      setMessageList((list) => [...list, data]);
      setTimeout(() => {
        audio.play();
    }, 500);
    };

    // האזנה להודעות חדשות
    socket.on("receive_message", handleReceiveMessage);

    // ניקוי מאזינים כדי למנוע כפילויות
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]); // תלות ישירה רק ב-socket

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="status-bar">9:41 AM</div>
        <div className="title">Live Chat</div>
        <div className="status-bar">🔋 100%</div>

        {/* חריץ מצלמה ורמקול */}
        <div className="iphone-notch">
          <div className="iphone-speaker"></div>
          <div className="iphone-camera"></div>
        </div>
      </div>
      <div className="chat-body">
        {/* הודעה ראשונית */}
        <div className="message received">
          <p>Hey, welcome to the chat!</p>
          <p className="time">9:45 AM</p>
        </div>
        <div className="message sent">
          <p>Thanks! Excited to be here 🚀</p>
          <p className="time">9:46 AM</p>
        </div>

        {/* הודעות דינמיות */}
        {messageList.map((messageContent, index) => {
          return (
            <div
              key={index}
              className={`message ${
                messageContent.author === username ? "sent" : "received"
              }`}
            >
            {/* הצגת שם השולח */}
               <p className="author">
                    {messageContent.author === username
                    ? "You"
                    : messageContent.author}
              </p>
              <p>{messageContent.message}</p>
              <p className="time">
                {messageContent.time}
                {messageContent.author === username && 
                    <span className="blue-tick">✔✔</span>
                }
              </p>
            </div>
          );
        })}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default ChatPlus;

