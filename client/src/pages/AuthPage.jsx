import React, { useEffect, useState } from "react";
import "./auth.css";
import Login from "./Login";
import Register from "./Register";

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    const container = document.getElementById("container");
    if (isSignIn) {
      container.classList.add("sign-in");
      container.classList.remove("sign-up");
    } else {
      container.classList.add("sign-up");
      container.classList.remove("sign-in");
    }
  }, [isSignIn]);

  return (
    <div id="container" className="container">
      {/* FORM SECTION */}
      <div className="row">
        {/* Sign Up */}
        <div className="col align-items-center flex-col sign-up">
          <Register toggle={() => setIsSignIn(true)} />
        </div>

        {/* Sign In */}
        <div className="col align-items-center flex-col sign-in">
          <Login toggle={() => setIsSignIn(false)} />
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="row content-row">
        <div className="col align-items-center flex-col">
          <div className="text sign-in">
            <h2>Welcome</h2>
          </div>
          <div className="img sign-in"></div>
        </div>

        <div className="col align-items-center flex-col">
          <div className="img sign-up"></div>
          <div className="text sign-up">
            <h2>Join with us</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
