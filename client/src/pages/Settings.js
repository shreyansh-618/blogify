"use client";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { deleteAllUserPosts } from "../redux/slices/postsSlice";
import { motion } from "framer-motion";
import "./Settings.css";

const Settings = () => {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleDeleteAllPosts = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all your posts? This action cannot be undone."
      )
    ) {
      try {
        setLoading(true);
        await dispatch(deleteAllUserPosts(user.id)).unwrap();
        setMessage({
          type: "success",
          text: "All posts deleted successfully!",
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: error.message || "Failed to delete posts",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        setLoading(true);
        // In a real app, you would call an API to delete the user account
        // For now, we'll just sign out
        await signOut();
        navigate("/");
      } catch (error) {
        setMessage({
          type: "error",
          text: error.message || "Failed to delete account",
        });
        setLoading(false);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to sign out",
      });
    }
  };

  return (
    <motion.div
      className="settings-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="settings-header">
        <h1>Account Settings</h1>
      </div>

      <div className="settings-content">
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <div className="settings-section">
          <h2>Account Management</h2>
          <p>Manage your account settings and preferences.</p>

          <div className="settings-actions">
            <button
              onClick={handleSignOut}
              className="settings-button sign-out-button"
              disabled={loading}
            >
              Sign Out
            </button>

            <button
              onClick={handleDeleteAllPosts}
              className="settings-button danger-button"
              disabled={loading}
            >
              Delete All Posts
            </button>

            <button
              onClick={handleDeleteAccount}
              className="settings-button danger-button"
              disabled={loading}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
