"use client";

import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostBySlug,
  updatePost,
  resetPostState,
} from "../redux/slices/postsSlice";
import { AuthContext } from "../context/AuthContext";
import RichTextEditor from "../components/editor/RichTextEditor";
import { motion } from "framer-motion";
import "./CreatePost.css"; // Reuse the same styles

const EditPost = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { posts, loading, success, error } = useSelector(
    (state) => state.posts
  );
  const post = posts.find((p) => p._id === id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageBase64, setCoverImageBase64] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("published");
  const [imagePreview, setImagePreview] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Redirect if post not found or user is not the author
    if (post) {
      if (post.authorId !== user.id) {
        navigate("/");
        return;
      }

      // Initialize form with post data
      setTitle(post.title || "");
      setContent(post.content || "");
      setExcerpt(post.excerpt || "");
      setCoverImageBase64(post.coverImage || "");
      setImagePreview(post.coverImage || null);
      setCategories(post.categories || []);
      setTags((post.tags || []).join(", "));
      setFeatured(post.featured || false);
      setStatus(post.status || "published");
    } else {
      // If post not found in Redux store, try to fetch it
      dispatch(getPostBySlug(id));
    }
  }, [user, navigate, post, id, dispatch]);

  // Redirect on successful post update
  useEffect(() => {
    if (success) {
      navigate("/profile");
      dispatch(resetPostState());
    }
  }, [success, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const postData = {
      _id: id,
      title,
      slug: post.slug, // Keep the original slug
      content,
      excerpt,
      coverImage: coverImageBase64 || post.coverImage, // Use new image or keep existing
      author: user?.user_metadata?.full_name || user?.email || "Anonymous",
      authorId: user?.id || "anonymous",
      categories,
      tags: tags.split(",").map((tag) => tag.trim()),
      featured,
      status,
      createdAt: post.createdAt, // Keep original creation date
      updatedAt: new Date().toISOString(), // Add update date
    };

    dispatch(updatePost(postData));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        setCoverImageBase64(base64String);
        setImagePreview(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  if (!post && !loading) {
    return <div className="post-not-found">Post not found</div>;
  }

  return (
    <div className="create-post-container">
      <motion.div
        className="create-post-form-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Edit Post</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter post title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
              placeholder="Brief summary of your post"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Cover Image</label>
            <input
              type="file"
              id="coverImage"
              onChange={handleImageChange}
              accept="image/*"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="categories">Categories</label>
            <select
              multiple
              id="categories"
              value={categories}
              onChange={(e) => {
                const options = [...e.target.selectedOptions];
                const values = options.map((option) => option.value);
                setCategories(values);
              }}
            >
              <option value="Technology">Technology</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Business">Business</option>
              <option value="Health">Health</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. javascript, web development, coding"
            />
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <label htmlFor="featured">Featured Post</label>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditPost;
