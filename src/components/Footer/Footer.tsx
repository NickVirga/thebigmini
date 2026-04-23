import "./Footer.scss";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <span>created by Nick Virga</span>
      <div className="footer__links">
        <a href="https://nickvirga.com" target="_blank" rel="noopener noreferrer">nickvirga.com</a>
        <Link to="/privacy">Privacy Policy</Link>
      </div>
    </footer>
  );
}

export default Footer;
