"use client";

import { useState, useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Settings, ChevronDown } from "../../components/common/Icons";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const settingsRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">
            <h1>Blogify</h1>
          </Link>
        </div>

        <nav className="header-nav desktop-nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/create-post" className="create-post-btn">
                    Write Post
                  </Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li className="settings-dropdown" ref={settingsRef}>
                  <button onClick={toggleSettings} className="settings-button">
                    <Settings />
                    <ChevronDown className={isSettingsOpen ? "rotate" : ""} />
                  </button>
                  {isSettingsOpen && (
                    <motion.div
                      className="settings-menu"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link to="/settings">Account Settings</Link>
                      <button
                        onClick={() =>
                          window.confirm(
                            "Are you sure you want to delete all your posts?"
                          ) && console.log("Delete all posts")
                        }
                      >
                        Delete All Posts
                      </button>
                      <button
                        onClick={() =>
                          window.confirm(
                            "Are you sure you want to delete your account? This action cannot be undone."
                          ) && console.log("Delete account")
                        }
                      >
                        Delete Account
                      </button>
                      <Link to="/logout">Sign Out</Link>
                    </motion.div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="register-btn">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <button className="menu-toggle" onClick={toggleMenu}>
          Menu
        </button>
      </div>

      {isMenuOpen && (
        <motion.nav
          className="mobile-nav"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/create-post">Write Post</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
                <li>
                  <Link to="/logout">Sign Out</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </motion.nav>
      )}
    </motion.header>
  );
};

export default Header;
