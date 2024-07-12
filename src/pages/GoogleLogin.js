import React, { useState, useEffect } from "react";
import Google from "../Images/google.png";
import "./index.css";
import { useNavigate } from "react-router-dom";

function GoogleLoginele() {
  let navigate = useNavigate();
  const [profile, setProfile] = useState({ state: false, text: "", user: {} });

  useEffect(() => {
    const params = new URLSearchParams(window?.location?.search);
    const error = params?.get("error");
    if (error) {
      alert("Failed to Login, Try again");
    }
    const accessToken = params?.get("access_token");
    const refreshToken = params?.get("refresh_token");
    const scope = params?.get("scope");
    const tokenType = params?.get("token_type");
    const expiryDate = params?.get("expiry_date");
    const email = params?.get("email");
    const name = params?.get("name");
    const googleId = params?.get("gid");

    if (accessToken && refreshToken && scope && tokenType && expiryDate) {
      const tokens = {
        access_token: accessToken,
        refresh_token: refreshToken,
        scope,
        token_type: tokenType,
        expiry_date: parseInt(expiryDate, 10),
      };
      const user = {
        name: name,
        email: email,
        googleId: googleId,
      };

      setProfile({
        state: true,
        text: "you are Logged",
        user: user,
      });
      localStorage.setItem("user", JSON.stringify(user));

      console.log(tokens);

      localStorage.setItem("googleTokens", JSON.stringify(tokens));
      console.log(tokens);
      setTimeout(() => {
        localStorage.clear();
      }, Math.abs(Date.now() - tokens.expiry_date));
    }
  }, [navigate]);

  const id =
    "1019918519182-bb74on44ac9gg4faq9rsml1tm3gn22pp.apps.googleusercontent.com";

  const handleLogin = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar%20https://www.googleapis.com/auth/userinfo.profile&access_type=offline&include_granted_scopes=true&response_type=code&client_id=${id}&redirect_uri=https://event-server-dp.onrender.com/api/events/oauth2callback`;
  };

  return (
    <>
      <div className="outer-Google-login">
        <div className="Login-container">
          <img src={Google} className="g-logo" />

          <div>
            {profile?.state ? (
              <>
                <p className="g-title">
                  '{profile?.user?.name}' {profile?.text}
                </p>
                <button onClick={() => navigate("/")} className="signin-btn">
                  Go to Home
                </button>
              </>
            ) : (
              <>
                {" "}
                <p className="g-title">Login with your Google Account</p>
                <button onClick={handleLogin} className="signin-btn">
                  Sign in with Google
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default GoogleLoginele;
