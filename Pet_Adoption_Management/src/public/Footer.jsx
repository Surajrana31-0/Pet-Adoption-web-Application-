import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, PawPrint } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <div className="logo-container">
              <div className="logo-icon">
                <PawPrint className="h-6 w-6" />
              </div>
              <span className="logo-text">
                PawHaven
              </span>
            </div>
            <p className="footer-text">
              Connecting loving families with adorable pets. We believe every pet deserves a loving home and every family deserves the joy of a furry companion.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="social-link">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="social-link">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/adopt" className="footer-link">
                  Adopt a Pet
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="footer-link">
                  Volunteer
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3 className="footer-heading">Services</h3>
            <ul className="footer-links">
              <li>
                <Link to="/pet-care" className="footer-link">
                  Pet Care Tips
                </Link>
              </li>
              <li>
                <Link to="/training" className="footer-link">
                  Training Resources
                </Link>
              </li>
              <li>
                <Link to="/veterinary" className="footer-link">
                  Veterinary Partners
                </Link>
              </li>
              <li>
                <Link to="/foster" className="footer-link">
                  Foster Program
                </Link>
              </li>
              <li>
                <Link to="/donate" className="footer-link">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="space-y-3">
              <div className="contact-item">
                <MapPin className="h-5 w-5 contact-icon" />
                <span className="footer-text">123 New Baneshower, Animal City, AC 12345</span>
              </div>
              <div className="contact-item">
                <Phone className="h-5 w-5 contact-icon" />
                <span className="footer-text">+1 (977) 123-4567</span>
              </div>
              <div className="contact-item">
                <Mail className="h-5 w-5 contact-icon" />
                <span className="footer-text">info@pawhaven.com</span>
              </div>
            </div>
            <div className="emergency-box">
              <p className="emergency-text">
                <Heart className="h-4 w-4" />
                <span>Emergency Pet Rescue: Available 24/7</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">
            © 2024 PawHaven. All rights reserved. Made with ♥ for pets and their families.
          </p>
          <div className="footer-legal">
            <Link to="/privacy" className="legal-link">
              Privacy Policy
            </Link>
            <Link to="/terms" className="legal-link">
              Terms of Service
            </Link>
            <Link to="/cookies" className="legal-link">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;