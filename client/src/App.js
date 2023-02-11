import { useEffect, useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Game from "./Game.js"
import NavBar from './NavBar.js';
import Login from './Login.js';
import Profile from './Profile.js';
import Friends from './Friends.js';

const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // auto-login
    fetch("/me").then((r) => {
      if (r.ok) { //response successful
        r.json().then((user) => {
          setUser(user)
        })
      }
    });
  }, []);

  if (!user) return <Login onLogin={setUser} />;



  return (
    <>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Game user={user} />} />
        <Route path="/user_profile" element={<Profile user={user} />} />
        <Route path="/friends" element={<Friends user={user} />} />
      </Routes>
    </>
  );
}

export default App;
