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
      <div style={{ marginTop: "6px" }}>
        Welcome {user.username}!</div>
      <Link to="/" style={{ textDecoration: "none", color: "inherit", fontWeight: "bold", marginTop: "6px" }}>Match 3 Game</Link>
      <Link to="/user_profile" style={{ textDecoration: "none", color: "inherit", fontWeight: "bold", marginTop: "6px" }}>User Profile</Link>
      <Link to="/friends" style={{ textDecoration: "none", color: "inherit", fontWeight: "bold", marginTop: "6px" }}>Friends</Link>
      <button onClick={handleLogoutClick}>Logout</button>
    </div>

  )
}
export default NavBar;
