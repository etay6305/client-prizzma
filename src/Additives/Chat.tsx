import './Chat.css';
import React, { useState, useEffect } from 'react';
//import { UserContext } from '../Components/UserContext';
import axios from 'axios';
// import Swal from 'sweetalert2';
import { io } from 'socket.io-client'; // הוספת Socket.IO
import { useNavigate } from 'react-router-dom';
const socket = io('http://localhost:5000');

function Chat() {
    //const { user } = useContext(UserContext);
    const [Friend, setFriend] = useState('');
    const [messages, setMessages] = useState<string[]>([]); // שמירת הודעות צ'אט
    const [messageInput, setMessageInput] = useState(''); // עבור שדה ההודעה
    const [connected, setIsConnected] = useState(false);
    const [name, setName] = useState('');
    const [friendRequests, setFriendRequests] =useState<FriendRequest[]>([]);// שמירת בקשות חברות
    
    const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:5000/getcookie', { withCredentials: true })
      .then((response) => {
        if(response.data.user) {
            setName(response.data.user); // שמירת הנתונים ב-state
            console.log(name);
        }
        // else {
        //     navigate('/login');
        // }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // navigate('/login');
      });
  }, [connected]); //בכל פעם שערך הconnected משתנה הuseeffect ירוץ מחדש

  interface FriendRequest {
    _id: string; // מזהה הבקשה
    from: string;
    // אם יש שדות נוספים שאתה רוצה להוסיף, תוכל להוסיף אותם כאן.
   }

    const acceptFriendRequest = (request : FriendRequest) => {
        // פונקציה לקבלת בקשת חברות
        axios.post('http://localhost:4000/accept-friend-request', {
            requestId: request._id // שליחת מזהה הבקשה לשרת
        })
        .then((response) => {
            console.log('Friend request accepted:', response.data);
            setFriendRequests(friendRequests.filter(req => req._id !== request._id)); // עדכון הרשימה
        })
        .catch((error) => {
            console.error("Error accepting request:", error);
        });
    };
    

    const sendMessage = () => {
        if (messageInput) {
            socket.emit('chat-message', `${name}: ${messageInput}`); // שליחת הודעה לשרת
            setMessageInput(''); // ניקוי שדה ההודעה
        }
    };
    const sendRequest = () => {
        if (Friend) {
            socket.emit('/Friend-Request', { from: name, to: Friend }); // שליחת הודעה לשרת
            setFriend(''); // ניקוי שדה ההודעה
        }
    };
    


    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true); // הלקוח מחובר
            console.log(connected);
        });
        
        socket.on('disconnect', () => {
            console.log('disconnected from server');
            setIsConnected(false); // הלקוח מנותק
        });

        socket.on('chat-message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });
        socket.on('Friend-Request', (request) => {
            setFriendRequests((prevRequests) => [...prevRequests, request]); // הוספת הבקשה לרשימה
            console.log(`New friend request from: ${request.from}`);
            // ניתן להוסיף כאן הודעת התרעה או פעולה נוספת
        });

        // ניקוי המאזין כאשר הרכיב מתפרק
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('chat-message');
            socket.off('Friend-Request');
        };
    }, []);
    

    return (
        <div className="Chat">
        <h3>Chat</h3>
        <div className="messages">
            {messages.map((msg, index) => (
                <p key={index}>{msg}</p>
            ))}
        </div>
        <div className="input-container">
            <input
                type="text"
                value={Friend}
                onChange={(e) => setFriend(e.target.value)}
                placeholder="your friend..."
            />
            <button onClick={sendRequest}>Send Friend Request</button>
        </div>
        <div>
            <h4>Friend Requests</h4>
            {friendRequests.map(request => (
                <div key={request._id}>
                    <p>Request from: {request.from}</p>
                    <button onClick={() => acceptFriendRequest(request)}>Accept</button>
                </div>
            ))}
        </div>
        <div className="input-container">
            <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={() => {
                if (messageInput) {
                    socket.emit('chat-message', `${name}: ${messageInput}`);
                    setMessageInput('');
                }
            }}>Send Message</button>
        </div>
    </div>
    );
}

export default Chat;
