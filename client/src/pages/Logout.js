"use client";

import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Logout = () => {
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await signOut();
      navigate("/");
    };

    performLogout();
  }, [signOut, navigate]);

  return (
    <div className="logout-container">
      <div className="logout-content">
        <h2>Signing out...</h2>
        <p>Please wait while we sign you out.</p>
      </div>
    </div>
  );
};

export default Logout;
