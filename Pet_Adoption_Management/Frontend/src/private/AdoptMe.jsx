import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Home, Calendar, Heart } from 'lucide-react';
import api, { getImageUrl } from '../services/api';
import '../styles/AdoptMe.css';
import { useToast } from '../components/ToastContext';

const AdoptMe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const addToast = useToast();
  
  const [formData, setFormData] = useState({
    adopter_name: '',
    adopter_email: '',
    adopter_phone: '',
    adopter_address: '',
    adoption_reason: '',
    experience_with_pets: '',
    living_situation: '',
    other_pets: '',
    children: '',
    work_schedule: ''
  });

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/pets/${id}`);
      setPet(response.data.data);
    } catch (err) {
      setError('Failed to load pet details');
      console.error('Error fetching pet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const adoptionData = {
        pet_id: parseInt(id),
        ...formData
      };

      await api.post('/adoptions', adoptionData);
      
      // Show success message and redirect
      addToast('Adoption application submitted successfully! We will review your application and contact you soon.', 'success');
      navigate('/dashboard?tab=applications');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit adoption application';
      setError(errorMessage);
      addToast(errorMessage, 'error');
      console.error('Error submitting adoption:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    // Navigate back to the View Pets section of the adopter dashboard
    navigate('/dashboard?tab=viewPets');
  };

  if (loading) {
    return (
      <div className="adopt-me-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="adopt-me-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error || 'Pet not found'}</p>
          <button className="btn-primary" onClick={handleBack}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="adopt-me-container">
      <div className="adopt-me-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>Adopt {pet.name}</h1>
      </div>

      <div className="adopt-me-content">
        <div className="pet-preview">
          <img 
            src={getImageUrl(pet.image_path) || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400'} 
            alt={pet.name} 
            className="pet-preview-image"
            onError={(e) => {
              e.target.src = 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
          <div className="pet-preview-info">
            <h2>{pet.name}</h2>
            <p>{pet.breed} • {pet.type}</p>
            <p>{pet.age} years old</p>
          </div>
        </div>

        <form className="adoption-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adopter_name">
                  <User size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="adopter_name"
                  name="adopter_name"
                  value={formData.adopter_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="adopter_email">
                  <Mail size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="adopter_email"
                  name="adopter_email"
                  value={formData.adopter_email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="adopter_phone">
                  <Phone size={16} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="adopter_phone"
                  name="adopter_phone"
                  value={formData.adopter_phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="adopter_address">
                  <Home size={16} />
                  Address *
                </label>
                <input
                  type="text"
                  id="adopter_address"
                  name="adopter_address"
                  value={formData.adopter_address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your address"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Adoption Details</h3>
            <div className="form-group">
              <label htmlFor="adoption_reason">
                <Heart size={16} />
                Why do you want to adopt {pet.name}? *
              </label>
              <textarea
                id="adoption_reason"
                name="adoption_reason"
                value={formData.adoption_reason}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Tell us why you want to adopt this pet..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="experience_with_pets">
                <Calendar size={16} />
                Experience with pets
              </label>
              <textarea
                id="experience_with_pets"
                name="experience_with_pets"
                value={formData.experience_with_pets}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe your experience with pets..."
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Living Situation</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="living_situation">
                  <Home size={16} />
                  Living Situation *
                </label>
                <select
                  id="living_situation"
                  name="living_situation"
                  value={formData.living_situation}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your living situation</option>
                  <option value="house">House with yard</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="other_pets">
                  <User size={16} />
                  Other pets in household
                </label>
                <input
                  type="text"
                  id="other_pets"
                  name="other_pets"
                  value={formData.other_pets}
                  onChange={handleInputChange}
                  placeholder="List any other pets"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="children">
                  <User size={16} />
                  Children in household
                </label>
                <select
                  id="children"
                  name="children"
                  value={formData.children}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="none">No children</option>
                  <option value="under_5">Under 5 years</option>
                  <option value="5_12">5-12 years</option>
                  <option value="over_12">Over 12 years</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="work_schedule">
                  <Calendar size={16} />
                  Work schedule
                </label>
                <select
                  id="work_schedule"
                  name="work_schedule"
                  value={formData.work_schedule}
                  onChange={handleInputChange}
                >
                  <option value="">Select your work schedule</option>
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="remote">Remote work</option>
                  <option value="flexible">Flexible schedule</option>
                  <option value="unemployed">Unemployed/Student</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleBack}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptMe; 