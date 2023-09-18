import React from 'react'
import{BrowserRouter,Route,Routes,route} from "react-router-dom"
import Register from './pages/Register'
import Login from './pages/Login'
import Chat from './pages/Chat'
import SetAvatar from './pages/SetAvatar'
const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/register" element={<Register/>}/>
    </Routes>
    <Routes>
      <Route path="/login" element={<Login/>}/>
    </Routes>
    <Routes>
      <Route path="/" element={<Chat/>}/>
    </Routes>
    <Routes>
      <Route path="/setavatar" element={<SetAvatar/>}/>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App