import React from "react";
import { Link } from "react-router-dom";
import "./index.css"
function NavBar({ user, setUser }) {
  function handleLogoutClick() {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setUser(null);
      }
    });
  }

  return (
    <div className="navbar">
      Welcome {user.username}!
      <Link to="/">Match 3 Game</Link>
      <Link to="/user_profile">User Profile</Link>
      <Link to="/friends">Friends</Link>
      <button onClick={handleLogoutClick}>Logout</button>
    </div>

  )
}
export default NavBar;
