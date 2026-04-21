import './Footer.css'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="main-footer">
      <div className="main-footer-inner">
        <div className="footer-brand">
          <i className="fa-solid fa-chart-line" aria-hidden="true" />
          <span>Expense Tracker</span>
        </div>
        
        <div className="footer-tagline">
          <i className="fa-solid fa-chart-simple" aria-hidden="true" />
          <span>Built to manage spending with clarity.</span>
          <i className="fa-solid fa-lightbulb" aria-hidden="true" />
        </div>
        
        <div className="footer-links">
          <Link to="/privacy">
            <i className="fa-solid fa-shield-halved" aria-hidden="true" />
            <span>Privacy</span>
          </Link>
          <Link to="/terms">
            <i className="fa-solid fa-file-contract" aria-hidden="true" />
            <span>Terms</span>
          </Link>
          <Link to="/support">
            <i className="fa-solid fa-headset" aria-hidden="true" />
            <span>Support</span>
          </Link>
          <Link to="/status">
            <i className="fa-solid fa-circle-check" aria-hidden="true" />
            <span>Status</span>
          </Link>
        </div>
        
        <div className="footer-divider" />
        
        <div className="footer-copyright">
          <i className="fa-regular fa-copyright" aria-hidden="true" />
          <span>{currentYear} Expense Tracker. All rights reserved.</span>
          <span className="footer-version">
            <i className="fa-solid fa-code-branch" aria-hidden="true" /> v1.0.0
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer