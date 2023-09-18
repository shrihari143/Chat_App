import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";


const SetAvatar = () => {
  const api = `https://api.multiavatar.com/4645646666`;
  
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  
  const Add_Avatar = async () => {
    try {
      const avatarPromises = Array.from({ length: 4 }, async (_, index) => {
        const image = await axios.get(`/${api}/${Math.round(Math.random() * 1000)}`);
        console.log("this is",image);
        const buffer = new Buffer(image.data);
        return buffer.toString("base64");
      });
  
      const avatars = await Promise.all(avatarPromises);
      setAvatars(avatars);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching avatars:", error);
      // Handle error, e.g., show a default avatar or a placeholder.
      setIsLoading(false);
    }
  };
  
  
  const setProfilePicture= async()=>{
    if(selectedAvatar===undefined){
      toast.error("please select an Avatar",toastOptions);
    }
    else{
      const user= await JSON.parse(localStorage.getItem("chat-app-user2"));
      const {data}= await axios.post(`/api/auth/setavatar/${user._id}`,{image:avatars[selectedAvatar],});
      console.log(data);
      if(data.success){
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user2",JSON.stringify(user));
        navigate("/");

      }
      else{
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
      
    }

  };
  useEffect(()=>{
    Add_Avatar();
  },);
 useEffect(()=>{
  if(!localStorage.getItem("chat-app-user2") ){
    navigate("/login");
  }  
  
 },);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
        <div className="logout">
          <Logout/>
        </div>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}

    </>
  )
}
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }
  .logout {
  position: fixed;
  top: 20px; 
  right: 20px; 
}


  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

export default SetAvatar