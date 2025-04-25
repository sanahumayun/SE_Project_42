import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token, role, userId, name } = await loginUser({ email, password });
      localStorage.setItem("token",    token);
      localStorage.setItem("role",     role);
      localStorage.setItem("userId",   userId);
      localStorage.setItem("userName", name);

      navigate(`/dashboard/${role}`, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
      <h1 className="welcome-title">Welcome to CodeKids</h1>
        <form onSubmit={handleLogin}>
          <h2>Log In</h2>
          {error && <div className="error-message">{error}</div>}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="primary">
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={{ marginTop: "1rem" }}>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
