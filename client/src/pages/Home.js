"use client";

import { useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../redux/slices/postsSlice";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/blog/PostCard";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { posts, loading } = useSelector((state) => state.posts);
  const { scrollYProgress } = useScroll();

  // References for sections to check if they're in view
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const postsRef = useRef(null);
  const ctaRef = useRef(null);

  // Check if sections are in view
  const heroInView = useInView(heroRef, { once: false, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.3 });
  const postsInView = useInView(postsRef, { once: false, amount: 0.1 });
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.5 });

  // Parallax effect for hero section
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle button clicks with page transition
  const handleGetStarted = () => {
    // If user is logged in, go to create post page, otherwise go to register
    const targetPage = user ? "/create-post" : "/register";

    // Apply exit animation and then navigate
    document.body.classList.add("page-exit-to-right");

    setTimeout(() => {
      navigate(targetPage);
      // Remove the class after navigation
      setTimeout(() => {
        document.body.classList.remove("page-exit-to-right");
      }, 100);
    }, 300); // Match this with the CSS animation duration
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section
        id="hero"
        className="hero-section"
        ref={heroRef}
        style={{ y: heroY, opacity }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Share Your Story With The World
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Create, publish, and grow your blog with our powerful platform
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button onClick={handleGetStarted} className="primary-button">
              Get Started
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="secondary-button"
            >
              Learn More
            </button>
          </motion.div>
        </div>
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <div className="arrow-scroll">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="features-section" ref={featuresRef}>
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: featuresInView ? 1 : 0,
              y: featuresInView ? 0 : 20,
            }}
            transition={{ duration: 0.8 }}
          >
            Why Choose BlogPlatform
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: featuresInView ? 1 : 0,
              y: featuresInView ? 0 : 20,
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Everything you need to create an amazing blog
          </motion.p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: featuresInView ? 1 : 0,
                y: featuresInView ? 0 : 20,
              }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest Posts Section */}
      <section
        id="latest-posts"
        className="latest-posts-section"
        ref={postsRef}
      >
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: postsInView ? 1 : 0, y: postsInView ? 0 : 20 }}
            transition={{ duration: 0.8 }}
          >
            Latest Posts
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: postsInView ? 1 : 0, y: postsInView ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover what our community is writing about
          </motion.p>
        </div>

        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts found. Be the first to create a post!</p>
            <button onClick={handleGetStarted} className="primary-button">
              Create Your First Post
            </button>
          </div>
        ) : (
          <motion.div
            className="posts-grid"
            initial="hidden"
            animate={postsInView ? "visible" : "hidden"}
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
            {posts.slice(0, 3).map((post) => (
              <motion.div
                key={post._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {posts.length > 0 && (
          <motion.div
            className="view-all-posts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: postsInView ? 1 : 0, y: postsInView ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/blog" className="secondary-button">
              View All Posts
            </Link>
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section id="cta" className="cta-section" ref={ctaRef}>
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: ctaInView ? 1 : 0, scale: ctaInView ? 1 : 0.9 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Ready to Start Your Blogging Journey?</h2>
          <p>
            Join thousands of writers and share your stories with the world.
          </p>
          <button onClick={handleGetStarted} className="primary-button">
            Create Your Blog Now
          </button>
        </motion.div>
      </section>
    </div>
  );
};

// Features data
const features = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    ),
    title: "Easy Content Creation",
    description:
      "Our intuitive editor makes it simple to create beautiful blog posts with rich media.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    title: "Growing Community",
    description:
      "Connect with other bloggers and readers who share your interests and passions.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
    title: "Responsive Design",
    description:
      "Your blog looks great on any device, from desktop computers to mobile phones.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    title: "User-Friendly",
    description:
      "No technical skills required. Start blogging in minutes with our easy-to-use platform.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    title: "Secure Platform",
    description:
      "Your content is safe with us. We provide top-notch security for your blog and data.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    title: "Global Reach",
    description:
      "Share your content with readers from around the world and grow your audience.",
  },
];

export default Home;
