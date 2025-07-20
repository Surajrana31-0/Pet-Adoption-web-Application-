import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Shield, Home as HomeIcon, Star, ArrowRight, PawPrint, Users, Award } from 'lucide-react';
import '../styles/Home.css'; // Assuming you have a CSS file for styling

const Home = () => {
  const featuredPets = [
    {
      id: 1,
      name: 'OHO',
      type: 'Dog',
      breed: 'Golden Retriever',
      age: '2 years',
      image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Friendly and energetic, loves playing fetch and swimming.',
    },
    {
      id: 2,
      name: 'COCO',
      type: 'Cat',
      breed: 'Persian',
      age: '1 year',
      image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Gentle and affectionate, perfect for a calm household.',
    },
    {
      id: 3,
      name: 'MAX',
      type: 'Dog',
      breed: 'German Shepherd',
      age: '3 years',
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Loyal and protective, great with kids and families.',
    },
  ];

  const stats = [
    { number: '5,00+', label: 'Happy Adoptions', icon: Heart },
    { number: '1,20+', label: 'Active Volunteers', icon: Users },
    { number: '50+', label: 'Partner Shelters', icon: HomeIcon },
    { number: '5+', label: 'Years Experience', icon: Award },
  ];

  const steps = [
    {
      step: 1,
      title: 'Browse Pets',
      description: 'Explore our database of adorable pets waiting for their forever homes.',
      icon: Search,
    },
    {
      step: 2,
      title: 'Meet & Greet',
      description: 'Schedule a visit to meet your potential new family member.',
      icon: Heart,
    },
    {
      step: 3,
      title: 'Adoption Process',
      description: 'Complete our simple adoption process and take your pet home.',
      icon: Shield,
    },
    {
      step: 4,
      title: 'Welcome Home',
      description: 'Enjoy life with your new companion and ongoing support from us.',
      icon: HomeIcon,
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background" style={{
          backgroundImage: "url('https://wallpaperbat.com/img/669960-aesthetic-cat-laptop-wallpaper-top-free-aesthetic-cat-laptop-background.jpg')"
        }}></div>
        
        <div className="hero-content">
          <div className="hero-grid">
            <div className="hero-text-content">
              <div className="hero-text-wrapper">
                <h1 className="hero-title">
                  Find Your
                  <span className="hero-title-highlight">Perfect Companion</span>
                </h1>
                <p className="hero-description">
                  Connect with loving pets looking for their forever homes. Every adoption creates a beautiful story of love, companionship, and happiness.
                </p>
              </div>
              
              <div className="hero-buttons">
                <Link to="/adopt" className="hero-button-primary">
                  <Search className="button-icon" />
                  <span>Find Pets</span>
                </Link>
                <Link to="/about" className="hero-button-secondary">
                  <span>Learn More</span>
                  <ArrowRight className="button-icon" />
                </Link>
              </div>

              <div className="stats-container">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-icon-wrapper">
                      <stat.icon className="stat-icon" />
                    </div>
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-image-container">
              <div className="hero-image-wrapper">
                <img
                  src="https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Happy family with adopted pets"
                  className="hero-image"
                />
              </div>
              <div className="hero-image-background"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Meet Our Featured Pets</h2>
            <p className="section-description">
              These adorable companions are ready to bring joy and love to your family. Each one has been carefully cared for and is waiting for their perfect match.
            </p>
          </div>

          <div className="pets-grid">
            {featuredPets.map((pet) => (
              <div key={pet.id} className="pet-card">
                <div className="pet-image-wrapper">
                  <img src={pet.image} alt={pet.name} className="pet-image" />
                  <button className="favorite-button">
                    <Heart className="favorite-icon" />
                  </button>
                </div>
                <div className="pet-details">
                  <div className="pet-header">
                    <h3 className="pet-name">{pet.name}</h3>
                    <span className="pet-age">{pet.age}</span>
                  </div>
                  <p className="pet-breed">{pet.breed} • {pet.type}</p>
                  <p className="pet-description">{pet.description}</p>
                  <button className="meet-pet-button">
                    <PawPrint className="button-icon" />
                    <span>Meet {pet.name}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="view-all-container">
            <Link to="/adopt" className="view-all-button">
              <span>View All Available Pets</span>
              <ArrowRight className="button-icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="process-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">How Pet Adoption Works</h2>
            <p className="section-description">
              Our simple and caring adoption process ensures the perfect match between pets and families. We're here to support you every step of the way.
            </p>
          </div>

          <div className="process-grid">
            {steps.map((step) => (
              <div key={step.step} className="process-card">
                <div className="process-step">{step.step}</div>
                <div className="process-icon-wrapper">
                  <step.icon className="process-icon" />
                </div>
                <h3 className="process-title">{step.title}</h3>
                <p className="process-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Happy Adoption Stories</h2>
            <p className="section-description">
              Read what our happy families have to say about their adoption experience.
            </p>
          </div>

          <div className="testimonials-grid">
            {[
              {
                name: 'Bhim Bahadur Rana',
                text: 'Adopting OHO was the best decision we ever made. The team at PawHaven made the process so smooth and supportive.',
                rating: 5,
                image: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Bhim_Bahadur_Pande.jpg',
              },
              {
                name: 'Samridhi Shrestha',
                text: 'COCO has brought so much joy to our family. The adoption process was thorough but caring. Highly recommend!',
                rating: 5,
                image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
              },
              {
                name: 'Sujan Shrestha',
                text: 'The staff truly cares about matching pets with the right families. Our Buddy is living his best life with us!',
                rating: 5,
                image: 'https://pkimgcdn.peekyou.com/6f5583e705c48ccfd4fb07a4e1f09743.jpeg',
              },
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="rating-stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="star-icon" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="author-image"
                  />
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-title">Happy Pet Parent</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Find Your Perfect Companion?</h2>
          <p className="cta-description">
            Join thousands of happy families who have found their perfect pets through PawHaven. Start your adoption journey today and experience the unconditional love of a furry friend.
          </p>
          <div className="cta-buttons">
            <Link to="/adopt" className="cta-button-primary">
              <Search className="button-icon" />
              <span>Browse Available Pets</span>
            </Link>
            <Link to="/signup" className="cta-button-secondary">
              <Heart className="button-icon" />
              <span>Join Our Community</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;