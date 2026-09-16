import React, { useState } from "react";
import axios from "axios";
import { getApiUrl } from "../config/api";
import "../styles/style.css";
import { useNavigate } from "react-router-dom";

function LoginRegister() {
  const [active, setActive] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mobileNo, setMobileNo] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (name === "" || email === "" || password === "") {
      alert("Please fill all the fields.");
      return;
    }

    const user = {
      name,
      email,
      password
    };

    // console.log(user);

    localStorage.setItem("user", JSON.stringify(user));

    alert("Registration successful !!")
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        getApiUrl("login.php"),
        {
          mobile_no: mobileNo,
          password: loginPassword,
        }
      );

      if (response.data.status === "success") {

        console.log("API Response:", response.data);

        localStorage.setItem(
          "token",
          response.data.data.token
        );

        localStorage.setItem(
          "currentUser",
          JSON.stringify(response.data.data)
        );

        localStorage.setItem(
          "isLoggedIn",
          "true"
        );

        navigate("/dashboard");

      } else {

        alert(response.data.message);

      }

    } catch (error) {

      if (error.response) {
        console.log("API Error:", error.response.data);
      } else {
        console.log(error);
      }

    }
  };

  return (
    <div className="login-page">
      <div className={`content ${active ? "active" : ""}`}>

        {/* Register Form */}
        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>

            <div className="input-group mb-3">
              <input
                type="text"
                placeholder="Name"
                className="form-control form-control-lg bg-light fs-6"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control form-control-lg bg-light fs-6"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group mb-3">
              <input
                type="password"
                className="form-control form-control-lg bg-light fs-6"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn submit-btn">
              Register
            </button>
          </form>
        </div>

        {/* Login Form */}
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Sign In</h1>

            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control form-control-lg bg-light fs-6"
                placeholder="Mobile Number"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
              />
            </div>

            <div className="input-group mb-3">
              <input
                type="password"
                className="form-control form-control-lg bg-light fs-6"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-between mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                />
                <label
                  className="form-check-label"
                  htmlFor="remember"
                >
                  Remember me
                </label>
              </div>

              <a href="/">Forgot Password?</a>
            </div>

            <button type="submit" className="btn submit-btn">
              Login
            </button>
          </form>
        </div>

        {/* Purple Sliding Panel */}
        <div className="toggle-container">
          <div className="toggle">

            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>
                Already have an account?
              </p>

              <button
                type="button"
                className="btn switch-btn"
                onClick={() => setActive(false)}
              >
                Login
              </button>
            </div>

            <div className="toggle-panel toggle-right">
              <h1>Hello Friend!</h1>
              <p>
                Don't have an account?
              </p>

              <button
                type="button"
                className="btn switch-btn"
                onClick={() => setActive(true)}
              >
                Register
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginRegister;