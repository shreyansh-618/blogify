"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../redux/slices/postsSlice";
import PostCard from "../components/blog/PostCard";
import { motion } from "framer-motion";
import "./Blog.css";

const Blog = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <motion.div
      className="blog-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="blog-header">
        <h1>Blog Posts</h1>
        <p>Discover stories, thinking, and expertise from our writers</p>
      </div>

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts found. Be the first to create a post!</p>
        </div>
      ) : (
        <motion.div
          className="blog-posts-grid"
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
          {posts.map((post) => (
            <motion.div
              key={post._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Blog;
