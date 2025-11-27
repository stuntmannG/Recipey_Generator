import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

 return (
  <div className="container">
    <div className=".card_wrapper">
      
      <div className="emoji-orbit">
        <span>🍲</span>
        <span>🍳</span>
         <span>🍽️</span>
        <span>🥣</span>
        
        
      </div>

      <div className="card">
        <h2>Log In</h2>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: "crimson" }}>{error}</p>}
          <button disabled={loading} type="submit">
            {loading ? "Loading..." : "Log In"}
          </button>
        </form>
        <p>
          Need an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  </div>
)}
