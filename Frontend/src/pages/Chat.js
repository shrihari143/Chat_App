import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { json, useNavigate } from "react-router-dom";
//import { io } from "socket.io-client";
import styled from "styled-components";
import Contact from "../components/Contact";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import{io} from "socket.io-client";

const Chat = () => {
  const socket=useRef();
  const navigate=useNavigate();
  const [contact,setcontact]=useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const[currentuser, setcurrentuser]=useState(undefined);
  const useeffect1 =async()=>{
    if(!localStorage.getItem("chat-app-user2")){
      navigate("/login")
      }
      else{
        setcurrentuser(await JSON.parse(localStorage.getItem("chat-app-user2")));
      }
  }
  const useeffect2=async()=>{
    if(currentuser){
      if(currentuser.isAvatarImageSet){
        const data= await axios.get(`/api/auth/getalluser/${currentuser.
        _id}`);
        //console.log(data);
        setcontact(data.data);
        
      }
      else{
        //console.log("hjj");
        navigate("/setavatar");
      }
    }
  }
  useEffect(()=>{
    useeffect1();
  },[]);
  useEffect(()=>{
    useeffect2();
  },[currentuser])
  //console.log(contact);
  //console.log(currentuser);
  useEffect(() => {
    if (currentuser) {
      socket.current = io("http://localhost:5000");
      socket.current.emit("add-user", currentuser._id);
    }
  }, [currentuser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
        <div className="container">
         <Contact contacts={contact.users} currentuser={currentuser} changeChat={handleChatChange}/>
         {
          currentChat===undefined?(<Welcome />):(<ChatContainer currentchat={currentChat} currentuser={currentuser} socket={socket} />)
         }
         


        </div>
      </Container>
    
  )
}
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat