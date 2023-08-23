import React, { useState, useEffect } from "react";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import { userDoLogin } from "@/actions/userActions";
import axios from "axios";

export const GoogleForm = ({ onLogin }) => {
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    console.log("google user", user);
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          //   setProfile(res.data);
          onLogin(res?.data?.email);
        })
        .catch((err) => console.log("eeor", err));
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div>
      {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
      {profile ? (
        <div>
          <img src={profile.picture} alt="user image" />
          <h3>User Logged in</h3>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
          <button onClick={logOut}>Log out</button>
        </div>
      ) : (
        <button onClick={() => login()}>Sign in with Google 🚀 </button>
      )}
    </div>
  );
};
