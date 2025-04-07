"use client";

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPostBySlug } from "../redux/slices/postsSlice";
import "./BlogPost.css";

const BlogPost = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { post, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    if (slug) {
      dispatch(getPostBySlug(slug));
    }
  }, [slug, dispatch]);

  if (loading) {
    return <div className="blog-post-loading">Loading post...</div>;
  }

  if (error) {
    return <div className="blog-post-error">{error}</div>;
  }

  if (!post) {
    return <div className="blog-post-error">Post not found</div>;
  }

  // Determine the image source - could be a base64 string, URL, or placeholder
  const coverImageSource = post.coverImage
    ? post.coverImage.startsWith("data:")
      ? post.coverImage
      : post.coverImage
    : null;

  return (
    <div className="blog-post-container">
      <article className="blog-post">
        <header className="blog-post-header">
          <h1>{post.title}</h1>

          <div className="blog-post-meta">
            <span className="blog-post-author">By {post.author}</span>
            <span className="blog-post-date">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {post.categories && (
            <div className="blog-post-categories">
              {post.categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/category/${category.toLowerCase()}`}
                  className="blog-post-category"
                >
                  {category}
                </Link>
              ))}
            </div>
          )}
        </header>

        {coverImageSource && (
          <div className="blog-post-cover">
            <img
              src={coverImageSource || "/placeholder.svg"}
              alt={post.title}
            />
          </div>
        )}

        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags && (
          <div className="blog-post-tags">
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                to={`/tag/${tag.toLowerCase()}`}
                className="blog-post-tag"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPost;
