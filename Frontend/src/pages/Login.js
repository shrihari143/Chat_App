import React ,{useState,useEffect} from 'react';

import styled from "styled-components";
import { Link ,useNavigate} from 'react-router-dom';
import logo from "../assets/bird_2.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from '../utills/ApiRoutes';

const Login = () => {
  const navigate= useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const[values,setvalues]=useState({
    
    email:"",
    password:"",
    
  });
  
  
  const handleSubmit = async(event) => {
    event.preventDefault();
    //alert("form");
    if (handleValidation()){
      try {
        // Send data to the backend using axios.post
        const response = await axios.post("/api/auth/login", values);
        console.log("response kya hai",response);

        if (response.data.success) {
          
        
          localStorage.setItem("chat-app-user2",JSON.stringify(response.data.user));

          toast.success(`Login Successful! }`);
          if(response.data.user.isAvatarImageSet){
            navigate("/");
          }
          else {
            navigate("/setavatar");
          }
          
          

        }

         else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error('This user name already used');
      }
    }
  };
  const handleValidation = () => {
    const {password,email } = values;
    if (password === "") {
      toast.error(
        "Enter Password",
        toastOptions
      );
      return false;
    } 
    else if (email==="") {
      toast.error(
        "Invalid.",
        toastOptions
      );
      return false;
    } 

    return true;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setvalues({ ...values, [name]: value });
  };
  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={logo} alt="logo" />
            <h1>𝓒𝓸𝓷𝓿𝓸𝓛𝓲𝓷𝓴</h1>
          </div>
         
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          
          <button type="submit">Submit</button>
          <span className='change'>
            Already have an account? <Link to="/register">register.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer/>
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }

  button {
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
      background-color:green;
    }
  }

  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
      &:hover {
      color:green;
    }
    }
  }
`;


export default Login;
