import { BRAND } from '../data'

export default function Footer() {
  return (
    <footer className="re-footer">
      <div className="re-footer-inner">
        <div className="re-footer-grid">
          <div className="re-footer-brand">
            <div className="re-nav-logo">
              <div className="re-nav-logo-icon">PH</div>
              {BRAND.name}
            </div>
            <p className="re-body-sm">
              India's most trusted real estate developer. Building dreams and crafting futures since {BRAND.founded}.
            </p>
            <div className="re-footer-social">
              <a href="#" className="re-footer-social-link" aria-label="Facebook">f</a>
              <a href="#" className="re-footer-social-link" aria-label="Instagram">ig</a>
              <a href="#" className="re-footer-social-link" aria-label="Twitter">𝕏</a>
              <a href="#" className="re-footer-social-link" aria-label="LinkedIn">in</a>
              <a href="#" className="re-footer-social-link" aria-label="YouTube">▶</a>
            </div>
          </div>

          <div>
            <h4 className="re-footer-heading">Properties</h4>
            <ul className="re-footer-links">
              <li><a className="re-footer-link" href="#">Luxury Apartments</a></li>
              <li><a className="re-footer-link" href="#">Premium Villas</a></li>
              <li><a className="re-footer-link" href="#">Penthouses</a></li>
              <li><a className="re-footer-link" href="#">Integrated Townships</a></li>
              <li><a className="re-footer-link" href="#">Commercial Spaces</a></li>
            </ul>
          </div>

          <div>
            <h4 className="re-footer-heading">Locations</h4>
            <ul className="re-footer-links">
              <li><a className="re-footer-link" href="#">Mumbai</a></li>
              <li><a className="re-footer-link" href="#">Bangalore</a></li>
              <li><a className="re-footer-link" href="#">Gurgaon</a></li>
              <li><a className="re-footer-link" href="#">Chennai</a></li>
              <li><a className="re-footer-link" href="#">Hyderabad</a></li>
              <li><a className="re-footer-link" href="#">Noida</a></li>
            </ul>
          </div>

          <div>
            <h4 className="re-footer-heading">Company</h4>
            <ul className="re-footer-links">
              <li><a className="re-footer-link" href="#">About Us</a></li>
              <li><a className="re-footer-link" href="#">Careers</a></li>
              <li><a className="re-footer-link" href="#">Media Center</a></li>
              <li><a className="re-footer-link" href="#">Investor Relations</a></li>
              <li><a className="re-footer-link" href="#">CSR Initiatives</a></li>
              <li><a className="re-footer-link" href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="re-footer-bottom">
          <p className="re-footer-copy">© 2026 {BRAND.name}. All rights reserved. RERA Registered.</p>
          <div className="re-footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">RERA Compliance</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
