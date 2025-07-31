import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar, MapPin, User } from 'lucide-react';
import api, { getImageUrl } from '../services/api';
import '../styles/PetDescription.css';
import { useToast } from '../components/ToastContext';

const PetDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const addToast = useToast();

  useEffect(() => {
    fetchPetDetails();
    checkFavoriteStatus();
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

  const checkFavoriteStatus = async () => {
    try {
      const response = await api.get('/favorites');
      const favorites = response.data.data || [];
      setIsFavorite(favorites.some(fav => fav.pet_id === parseInt(id)));
    } catch (err) {
      console.error('Error checking favorite status:', err);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
        addToast('Pet removed from favorites successfully!', 'success');
      } else {
        await api.post(`/favorites/${id}`);
        setIsFavorite(true);
        addToast('Pet added to favorites successfully!', 'success');
      }
    } catch (err) {
      console.error('Error updating favorites:', err);
      if (err.response?.status === 409) {
        addToast('This pet is already in your favorites!', 'warning');
      } else {
        addToast('Failed to update favorites. Please try again.', 'error');
      }
    }
  };

  const handleAdopt = () => {
    navigate(`/adopt/${id}`);
  };

  const handleBack = () => {
    // Navigate back to the View Pets section of the adopter dashboard
    navigate('/dashboard?tab=viewPets');
  };

  if (loading) {
    return (
      <div className="pet-description-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="pet-description-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error || 'Pet not found'}</p>
          <button className="btn-primary" onClick={handleBack}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pet-description-container">
      <div className="pet-description-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>{pet.name}</h1>
      </div>

      <div className="pet-description-content">
        <div className="pet-image-section">
          <img 
            src={getImageUrl(pet.image_path) || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600'} 
            alt={pet.name} 
            className="pet-description-image"
            onError={(e) => {
              e.target.src = 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600';
            }}
          />
        </div>

        <div className="pet-details-section">
          <div className="pet-basic-info">
            <h2>{pet.name}</h2>
            <div className="pet-tags">
              <span className="pet-tag breed">{pet.breed}</span>
              <span className="pet-tag type">{pet.type}</span>
            </div>
          </div>

          <div className="pet-stats">
            <div className="stat-item">
              <Calendar size={20} />
              <span>{pet.age} years old</span>
            </div>
            <div className="stat-item">
              <MapPin size={20} />
              <span>{pet.status}</span>
            </div>
          </div>

          <div className="pet-description-text">
            <h3>About {pet.name}</h3>
            <p>{pet.description || 'No description available for this pet.'}</p>
          </div>

          <div className="pet-actions">
            <button 
              className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
              onClick={handleAddToFavorites}
            >
              <Heart size={20} />
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <button className="adopt-button" onClick={handleAdopt}>
              <User size={20} />
              Adopt Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDescription; 