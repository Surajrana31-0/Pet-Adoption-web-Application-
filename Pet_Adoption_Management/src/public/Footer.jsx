import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer>
    <div className="footer-content">
      <div className="footer-column">
        <h3>PetHome</h3>
        <p>Connecting loving families with pets in need since 2015.</p>
        <div className="social-links">
          <a href="#">f</a>
          <a href="#">t</a>
          <a href="#">ig</a>
          <a href="#">in</a>
        </div>
      </div>
      <div className="footer-column">
        <h3>Adoption</h3>
        <ul>
          <li><a href="#">Find a Pet</a></li>
          <li><a href="#">Adoption Process</a></li>
          <li><a href="#">Adoption Fees</a></li>
          <li><a href="#">Success Stories</a></li>
        </ul>
      </div>
      <div className="footer-column">
        <h3>Resources</h3>
        <ul>
          <li><a href="#">Pet Care Guides</a></li>
          <li><a href="#">Training Tips</a></li>
          <li><a href="#">Veterinary Care</a></li>
          <li><a href="#">Pet-Friendly Housing</a></li>
        </ul>
      </div>
      <div className="footer-column">
        <h3>Company</h3>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Our Team</a></li>
          <li><a href="#">Partners</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </div>
    <div className="copyright">
      &copy; 2023 PetHome Adoption Platform. All rights reserved.
    </div>
  </footer>
);

export default Footer;