import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const ChatContainer = ({currentchat,currentuser,socket}) => {
  const [msg1, setMsg] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  

  const getmsg = async () => {
    try {
      if(currentchat){
      const response = await axios.post("/api/msg/getmsg", {
        from: currentuser._id,
        to: currentchat._id,
      });
      //console.log("asd",response.data);
      setMsg(response.data);
       // Corrected the function name for setting the state
    }

    } catch (error) {

    }
  }

  useEffect(() => {
    getmsg();

  }, [currentchat]);
    //console.log("hello",currentusers)
    const handleSendMsg=async(msg)=>{
     //alert("msg")
     const resultant= axios.post("/api/msg/addmsg",
     {from:currentuser._id,
      to:currentchat._id,
      message:msg,
    });
    socket.current.emit("send-msg", {
      to: currentchat._id,
      from: currentuser._id,
      msg,
    });
    const msgs = [...msg1];
    msgs.push({ fromSelf: true, message: msg });
    setMsg(msgs);
    }
    useEffect(()=>{
      if (socket.current) {
        socket.current.on("msg-recieve", (msg) => {
          setArrivalMessage({ fromSelf: false, message: msg });
        });
      }

    },[]);
    useEffect(() => {
      arrivalMessage && setMsg((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);
  
    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [msg1]);

  return (
    <Container>
    <div className="chat-header">
        <div className="user-details">
            <div className="avatar">
            <img 
                src={`data:image/svg+xml;base64,${currentchat.avatarImage}`}
                alt="avatar"
            />

            </div>
            <div className="username">
                 <h3>{currentchat.username}</h3>
            </div>
            
        </div>
        
    </div>
    <div className="chat-messages">
    {
      msg1.map((message)=>{
        return(
          <div ref={scrollRef} key={uuidv4()}>
          <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
          <div className="content">
          <p>{message.message}</p>

          </div>

          </div>

          </div>
        )
      })
    }

    </div>
    <div className="chat-input">
    <ChatInput handleSendMsg=  {handleSendMsg}/>
    </div>   
    </Container>
  )
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContainer