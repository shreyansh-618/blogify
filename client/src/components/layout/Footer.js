import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Link to="/">
            <h2>Blogify</h2>
          </Link>
          <p>A place to share your thoughts and ideas.</p>
        </div>
        <div className="footer-links">
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <ul>
              <li>
                <a href="mailto:shreyanshc582@gmail.com">
                  shreyanshc582@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Blogify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
