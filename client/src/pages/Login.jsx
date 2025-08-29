import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = ({ toggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      const { access_token, role } = response.data;

      // Store token and role
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);

      // Redirect to role-based dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Check credentials.");
    }
    // TODO: Send login request to backend
    console.log("Logging in with:", email, password);
  };

  return (
    <div className="form-wrapper align-items-center">
      <div className="form sign-in">
        <div className="input-group">
          <i className="bx bxs-user"></i>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <i className="bx bxs-lock-alt"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Sign in</button>
        <p>
          <b>Forgot password?</b>
        </p>
        <p>
          <span>Don't have an account?</span>
          <b onClick={toggle} className="pointer">
            Sign up here
          </b>
        </p>
      </div>
    </div>
  );
};

export default Login;
