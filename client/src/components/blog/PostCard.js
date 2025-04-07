import { Link } from "react-router-dom";
import "./PostCard.css";

const PostCard = ({ post }) => {
  // For demo purposes, create a placeholder post if none is provided
  const demoPost = {
    _id: "1",
    title: "Getting Started with React",
    slug: "getting-started-with-react",
    excerpt: "Learn the basics of React and how to build your first component.",
    coverImage: "https://placehold.co/600x400",
    author: "John Doe",
    categories: ["Technology", "Web Development"],
    createdAt: new Date().toISOString(),
  };

  const displayPost = post || demoPost;

  // Determine the image source - could be a base64 string, URL, or placeholder
  const imageSource = displayPost.coverImage
    ? displayPost.coverImage.startsWith("data:")
      ? displayPost.coverImage
      : displayPost.coverImage
    : "https://placehold.co/600x400";

  return (
    <div className="post-card">
      <Link to={`/post/${displayPost.slug}`} className="post-card-link">
        <div className="post-card-image-container">
          <img
            src={imageSource || "/placeholder.svg"}
            alt={displayPost.title}
            className="post-card-image"
          />
        </div>
        <div className="post-card-content">
          <div className="post-card-categories">
            {displayPost.categories &&
              displayPost.categories.map((category, index) => (
                <span key={index} className="post-card-category">
                  {category}
                </span>
              ))}
          </div>
          <h2 className="post-card-title">{displayPost.title}</h2>
          <p className="post-card-excerpt">{displayPost.excerpt}</p>
          <div className="post-card-meta">
            <span className="post-card-author">By {displayPost.author}</span>
            <span className="post-card-date">
              {new Date(displayPost.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
