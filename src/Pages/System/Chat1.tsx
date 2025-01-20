import React, { useState, useEffect } from "react";
import "./Chat1.css";
import { io } from "socket.io-client";
import ChatPlus from './ChatPlus';
import Draggable from 'react-draggable'; // ספריית גרירה
const socket = io("http://localhost:5000", {
    withCredentials: true,
    transports: ["websocket"],
  });
function Chat1() {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");

    const joinRoom = () => {
        if(username !== "" && room !== "") {
            socket.emit("join_room", room);
        }
    };
   return (
    <Draggable>
   <div className="Chat1">
    <div className="joinChatContainer">
    <h3>Join A chat</h3>
        <input 
        type="text" 
        placeholder="Jhon..." 
        value={username || ""} // הבטחה שערך לא יהיה undefined
        onChange={(e) => {setUsername(e.target.value)}}/>
        
        <input 
        type="text" 
        placeholder="Room ID..."
        value={room}
        onChange={(e) => {setRoom(e.target.value)}}/>
        <button onClick={joinRoom}>Join A Room</button>
    </div>
    <ChatPlus socket={socket} username={username} room={room}/>
   </div>
   </Draggable>
   );
}

export default Chat1;