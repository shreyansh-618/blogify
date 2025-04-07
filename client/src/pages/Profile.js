"use client";

import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { getPosts, deletePost } from "../redux/slices/postsSlice";
import { motion } from "framer-motion";
import { Edit, Trash, Eye } from "../components/common/Icons";
import "./Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'posts'

  // Get posts from Redux store
  const { posts, loading: postsLoading } = useSelector((state) => state.posts);
  const userPosts = posts.filter((post) => post.authorId === user?.id);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Initialize form with user data
    setName(user.user_metadata?.full_name || user.user_metadata?.name || "");
    setBio(user.user_metadata?.bio || "");
    setWebsite(user.user_metadata?.website || "");

    // Fetch posts
    dispatch(getPosts());
  }, [user, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // In a real app, you would update the user metadata here
      // For now, we'll just simulate a successful update
      setTimeout(() => {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
      setLoading(false);
    }
  };

  const handleDeletePost = (postId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      dispatch(deletePost(postId));
    }
  };

  if (!user) return null;

  // Get user display name or email
  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "User";

  // Get first letter for avatar
  const avatarLetter = (displayName.charAt(0) || "U").toUpperCase();

  return (
    <motion.div
      className="profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-header">
        <h1>Your Profile</h1>
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`profile-tab ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            Your Posts
          </button>
        </div>
      </div>

      <div className="profile-content">
        <motion.div
          className="profile-sidebar"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="profile-avatar">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url || "/placeholder.svg"}
                alt="Profile"
              />
            ) : (
              <div className="avatar-placeholder">{avatarLetter}</div>
            )}
          </div>

          <div className="profile-info">
            <h2>{displayName}</h2>
            <p>{user.email}</p>
          </div>
        </motion.div>

        {activeTab === "profile" ? (
          <motion.div
            className="profile-form-container"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2>Edit Profile</h2>

            {message && (
              <div className={`message ${message.type}`}>{message.text}</div>
            )}

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows="4"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <button
                type="submit"
                className="update-button"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            className="user-posts-container"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2>Your Posts</h2>

            {postsLoading ? (
              <div className="loading-posts">Loading your posts...</div>
            ) : userPosts.length === 0 ? (
              <div className="no-posts">
                <p>You haven't published any posts yet.</p>
                <Link to="/create-post" className="create-first-post-button">
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <motion.div
                className="user-posts-list"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {userPosts.map((post) => (
                  <motion.div
                    key={post._id}
                    className="user-post-item"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="user-post-image">
                      <img
                        src={
                          post.coverImage?.startsWith("data:")
                            ? post.coverImage
                            : post.coverImage || "/placeholder.svg"
                        }
                        alt={post.title}
                      />
                    </div>
                    <div className="user-post-details">
                      <h3>{post.title}</h3>
                      <p className="user-post-excerpt">{post.excerpt}</p>
                      <div className="user-post-meta">
                        <span className="user-post-date">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="user-post-status">
                          {post.status === "published" ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="user-post-actions">
                      <Link
                        to={`/post/${post.slug}`}
                        className="view-post-button"
                      >
                        <Eye /> View
                      </Link>
                      <Link
                        to={`/edit-post/${post._id}`}
                        className="edit-post-button"
                      >
                        <Edit /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="delete-post-button"
                      >
                        <Trash /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
