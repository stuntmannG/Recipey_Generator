import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function onLogout() {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (e) {
      alert(e?.message || "Logout failed");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Dashboard</h2>
        <p>Welcome{user?.email ? `, ${user.email}` : ""}!</p>
        <nav>
          <Link to="/recipe">Recipe</Link>
          <Link to="/my-recipes">My Recipes</Link>
          <Link to="/signup">Create account</Link>
        </nav>
        <hr />
        <button onClick={onLogout}>Log out</button>
      </div>
    </div>
  );
}
