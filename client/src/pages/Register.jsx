import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Register = ({ toggle }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      console.log("Registering:", { name, email, password, role });
      // 1. Send registration request
      const res = await axios.post("http://localhost:8000/auth/register", {
        name,
        email,
        password,
        role,
      });

      // 2. Immediately log in the user after successful registration
      const loginRes = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      const { access_token, role: userRole } = loginRes.data;

      // 3. Save to localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", userRole);

      // 4. Navigate to /dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Registration failed. Maybe email already in use?");
    }
    // TODO: Send register request to backend
  };

  return (
    <div className="form-wrapper align-items-center">
      <div className="form sign-up">
        <div className="input-group">
          <i className="bx bxs-user"></i>
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <i className="bx bx-mail-send"></i>
          <input
            type="email"
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
        <div className="input-group">
          <i className="bx bxs-lock-alt"></i>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="input-group">
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="retailer">Retailer</option>
          </select>
        </div>
        <button onClick={handleRegister}>Sign up</button>
        <p>
          <span>Already have an account?</span>
          <b onClick={toggle} className="pointer">
            Sign in here
          </b>
        </p>
      </div>
    </div>
  );
};

export default Register;
