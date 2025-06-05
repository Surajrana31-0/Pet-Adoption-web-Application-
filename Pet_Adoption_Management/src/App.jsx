import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './public/Home';
import Login from './public/Login';
import Registration from './public/Registration';
import './App.css';

function App() {
  // State for mobile menu toggle
  const [navOpen, setNavOpen] = useState(false);

  // Search handler
  function handleSearch(e) {
    e.preventDefault();
    const searchInput = e.target[0].value;
    const petType = e.target[1].value;
    alert(`Searching for ${petType || 'all pets'} with criteria: ${searchInput}`);
  }


  function Login() {
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    // ...your login logic...
    navigate('/'); // Redirect to home after login
  }

  return (
    <form onSubmit={handleLogin}>
      {/* login fields */}
      <button type="submit">Login</button>
    </form>
  );
}

  return (
    <Router>
      {/* Header/Navigation */}
      <header>
        <nav className="navbar">

          <Link to="/" className="logo">Pet<span>Home</span></Link>
          <div className="nav-links" style={{ display: navOpen ? 'flex' : '' }}>
            <Link to="/">Home</Link>
            <Link to="/adopt">Adopt</Link>
            <Link to="/rehome">Rehome</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/about">About</Link>
            <Link to="/Register" className="cta-button">Sign Up</Link>
            <Link to="/Login" className="cta-button">Login</Link>
          {/* <a href="#" className="logo">Pet<span>Home</span></a>
          <div className="nav-links" style={{ display: navOpen ? 'flex' : '' }}>
            <a href="#">Home</a>
            <a href="#">Adopt</a>
            <a href="#">Rehome</a>
            <a href="#">Resources</a>
            <a href="#">About</a>
            <a href="#" className="cta-button">Sign Up</a>
            <a href="#" className="cta-button">Login</a> */}
          </div>
          <button
            className="mobile-menu-button"
            onClick={() => setNavOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Find Your Perfect Pet Comrade</h1>
        <p>
          Thousands of pets are waiting for their forever homes. Browse our database to find dogs, cats, and other animals available for adoption near you.
        </p>
        <div className="search-container">
          <form className="search-form" onSubmit={handleSearch}>
            <input type="text" className="search-input" placeholder="Search by breed, age, or location..." />
            <select className="search-input">
              <option value="">All Pets</option>
              <option value="dog">Dogs</option>
              <option value="cat">Cats</option>
              <option value="other">Other Animals</option>
            </select>
            <button type="submit" className="search-button">Search</button>
          </form>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="pets-section">
        <div className="section-title">
          <h2>Featured Pets</h2>
          <p>These adorable pets are looking for loving families</p>
        </div>
        <div className="pets-grid">
          {/* Pet Card 1 */}
          <div className="pet-card">
            <img
              src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              alt="Golden Retriever"
              className="pet-image"
            />
            <div className="pet-info">
              <h3>Max</h3>
              <div className="pet-meta">
                <span>Golden Retriever</span>
                <span>2 years</span>
              </div>
              <p className="pet-description">
                Friendly and energetic golden retriever who loves playing fetch and going for long walks.
              </p>
              <a href="#" className="adopt-button">Meet Max</a>
            </div>
          </div>

          {/* Pet Card 2 */}
          <div className="pet-card">
            <img
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              alt="Cat"
              className="pet-image"
            />
            <div className="pet-info">
              <h3>Luna</h3>
              <div className="pet-meta">
                <span>Domestic Shorthair</span>
                <span>1 year</span>
              </div>
              <p className="pet-description">
                Playful and affectionate cat who enjoys cuddles and chasing toy mice.
              </p>
              <a href="#" className="adopt-button">Meet Luna</a>
            </div>
          </div>

          {/* Pet Card 3 */}
          <div className="pet-card">
            <img
              src="https://images.unsplash.com/photo-1558788353-f76d92427f16?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              alt="Puppy"
              className="pet-image"
            />
            <div className="pet-info">
              <h3>Buddy</h3>
              <div className="pet-meta">
                <span>Labrador Mix</span>
                <span>8 months</span>
              </div>
              <p className="pet-description">
                Adorable puppy full of energy and love. Great with kids and other pets.
              </p>
              <a href="#" className="adopt-button">Meet Buddy</a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-title">
          <h2>How Pet Adoption Works</h2>
          <p>Our simple process makes finding your new best friend easy</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-icon">🔍</div>
            <h3>Search</h3>
            <p>Browse our database of adoptable pets and find ones that match your lifestyle and preferences.</p>
          </div>
          <div className="step">
            <div className="step-icon">🏠</div>
            <h3>Meet</h3>
            <p>Connect with shelters or foster families to arrange a meeting with your potential new pet.</p>
          </div>
          <div className="step">
            <div className="step-icon">❤️</div>
            <h3>Adopt</h3>
            <p>Complete the adoption process and bring your new family member home!</p>
          </div>
        </div>
      </section>

      {/* Footer */}
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

      {/* 
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </div>
      */}
    </Router>
  );
}

export default App;




















// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './components/Home';
// import Login from './components/Login';
// import Registration from './components/Registration';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       {/* Header/Navigation */}
//     <header>
//         <nav class="navbar">
//             <a href="#" class="logo">Pet<span>Home</span></a>
            
//             <div class="nav-links">
//                 <a href="#">Home</a>
//                 <a href="#">Adopt</a>
//                 <a href="#">Rehome</a>
//                 <a href="#">Resources</a>
//                 <a href="#">About</a>
//                 <a href="#" class="cta-button">Sign Up</a>
//                 <a href="#" class="cta-button">Login</a>
//             </div>
            
//             <button class="mobile-menu-button">☰</button>
//         </nav>
//     </header>
// {/*     <!-- Hero Section --> */}
//     <section class="hero">
//         <h1>Find Your Perfect Pet Comrade  </h1>
//         <p>Thousands of pets are waiting for their forever homes. Browse our database to find dogs, cats, and other animals available for adoption near you.</p>
        
//         <div class="search-container">
//             <form class="search-form">
//                 <input type="text" class="search-input" placeholder="Search by breed, age, or location...">
//                 <select class="search-input">
//                     <option value="">All Pets</option>
//                     <option value="dog">Dogs</option>
//                     <option value="cat">Cats</option>
//                     <option value="other">Other Animals</option>
//                 </select>
//                 <button type="submit" class="search-button">Search</button>
//             </form>
//         </div>
//     </section>

//     {/* <!-- Featured Pets --> */}
//     <section class="pets-section">
//         <div class="section-title">
//             <h2>Featured Pets</h2>
//             <p>These adorable pets are looking for loving families</p>
//         </div>
        
//         <div class="pets-grid">
//             <!-- Pet Card 1 -->
//             <div class="pet-card">
//                 <img src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Golden Retriever" class="pet-image">
//                 <div class="pet-info">
//                     <h3>Max</h3>
//                     <div class="pet-meta">
//                         <span>Golden Retriever</span>
//                         <span>2 years</span>
//                     </div>
//                     <p class="pet-description">Friendly and energetic golden retriever who loves playing fetch and going for long walks.</p>
//                     <a href="#" class="adopt-button">Meet Max</a>
//                 </div>
//             </div>

//             {/* <!-- Pet Card 2 --> */}
//             <div class="pet-card">
//                 <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Cat" class="pet-image">
//                 <div class="pet-info">
//                     <h3>Luna</h3>
//                     <div class="pet-meta">
//                         <span>Domestic Shorthair</span>
//                         <span>1 year</span>
//                     </div>
//                     <p class="pet-description">Playful and affectionate cat who enjoys cuddles and chasing toy mice.</p>
//                     <a href="#" class="adopt-button">Meet Luna</a>
//                 </div>
//             </div>
            
//             {/* <!-- Pet Card 3 --> */}
//             <div class="pet-card">
//                 <img src="https://images.unsplash.com/photo-1558788353-f76d92427f16?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Puppy" class="pet-image">
//                 <div class="pet-info">
//                     <h3>Buddy</h3>
//                     <div class="pet-meta">
//                         <span>Labrador Mix</span>
//                         <span>8 months</span>
//                     </div>
//                     <p class="pet-description">Adorable puppy full of energy and love. Great with kids and other pets.</p>
//                     <a href="#" class="adopt-button">Meet Buddy</a>
//                 </div>
//             </div>
//         </div>
//     </section>

//     {/* <!-- How It Works --> */}
//     <section class="how-it-works">
//         <div class="section-title">
//             <h2>How Pet Adoption Works</h2>
//             <p>Our simple process makes finding your new best friend easy</p>
//         </div>
        
//         <div class="steps">
//             <div class="step">
//                 <div class="step-icon">🔍</div>
//                 <h3>Search</h3>
//                 <p>Browse our database of adoptable pets and find ones that match your lifestyle and preferences.</p>
//             </div>
            
//             <div class="step">
//                 <div class="step-icon">🏠</div>
//                 <h3>Meet</h3>
//                 <p>Connect with shelters or foster families to arrange a meeting with your potential new pet.</p>
//             </div>
            
//             <div class="step">
//                 <div class="step-icon">❤️</div>
//                 <h3>Adopt</h3>
//                 <p>Complete the adoption process and bring your new family member home!</p>
//             </div>
//         </div>
//     </section>
    
//     {/* <!-- Footer --> */}
//     <footer>
//         <div class="footer-content">
//             <div class="footer-column">
//                 <h3>PetHome</h3>
//                 <p>Connecting loving families with pets in need since 2015.</p>
//                 <div class="social-links">
//                     <a href="#">f</a>
//                     <a href="#">t</a>
//                     <a href="#">ig</a>
//                     <a href="#">in</a>
//                 </div>
//             </div>
            
//             <div class="footer-column">
//                 <h3>Adoption</h3>
//                 <ul>
//                     <li><a href="#">Find a Pet</a></li>
//                     <li><a href="#">Adoption Process</a></li>
//                     <li><a href="#">Adoption Fees</a></li>
//                     <li><a href="#">Success Stories</a></li>
//                 </ul>
//             </div>
            
//             <div class="footer-column">
//                 <h3>Resources</h3>
//                 <ul>
//                     <li><a href="#">Pet Care Guides</a></li>
//                     <li><a href="#">Training Tips</a></li>
//                     <li><a href="#">Veterinary Care</a></li>
//                     <li><a href="#">Pet-Friendly Housing</a></li>
//                 </ul>
//             </div>
            
//             <div class="footer-column">
//                 <h3>Company</h3>
//                 <ul>
//                     <li><a href="#">About Us</a></li>
//                     <li><a href="#">Our Team</a></li>
//                     <li><a href="#">Partners</a></li>
//                     <li><a href="#">Contact</a></li>
//                 </ul>
//             </div>
//         </div>
        
//         <div class="copyright">
//             &copy; 2023 PetHome Adoption Platform. All rights reserved.
//         </div>
//     </footer>
    
//     <script>
//         // Mobile Menu Toggle
//         const mobileMenuButton = document.querySelector('.mobile-menu-button');
//         const navLinks = document.querySelector('.nav-links');
        
//         mobileMenuButton.addEventListener('click', () => {
//             navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
//         });
        
//         // Pet Search Functionality
//         const searchForm = document.querySelector('.search-form');
        
//         searchForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             const searchInput = document.querySelector('.search-input').value;
//             const petType = document.querySelector('select').value;
            
//             // In a real app, this would filter pets from an API
//             alert(`Searching for ${petType || 'all pets'} with criteria: ${searchInput}`);
//         });
        
//         // Smooth scrolling for anchor links
//         document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//             anchor.addEventListener('click', function(e) {
//                 e.preventDefault();
//                 document.querySelector(this.getAttribute('href')).scrollIntoView({
//                     behavior: 'smooth'
//                 });
//             });
//         });
        
//         // Pet card hover effects
//         const petCards = document.querySelectorAll('.pet-card');
        
//         petCards.forEach(card => {
//             card.addEventListener('mouseenter', () => {
//                 card.style.transform = 'translateY(-5px)';
//                 card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
//             });
            
//             card.addEventListener('mouseleave', () => {
//                 card.style.transform = '';
//                 card.style.boxShadow = '0 3px 10px rgba(0,0,0,0.3)';
//             });
//         });
//     </script>



      
//       {/* <div className="App">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Registration />} />
//         </Routes>
//       </div> */}
//     </Router>
//   );
// }

// export default App;
