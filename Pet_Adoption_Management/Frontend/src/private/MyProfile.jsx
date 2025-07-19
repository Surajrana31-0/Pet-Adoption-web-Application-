import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext.jsx';
import api, { getImageUrl } from '../services/api';
import '../styles/MyProfile.css';

const MyProfile = () => {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get('/users/profile');
        setProfile(res.data.profile);
        setAdoptedPets(res.data.adoptedPets || []);
        setError(null);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!profile) return null;

  return (
    <div className="my-profile-root">
      <div className="profile-header">
        <div className="profile-pic-section">
          <div className="profile-pic-wrapper">
            <img
              src={profile.image_path ? getImageUrl(profile.image_path) : '/default-user.png'}
              alt="Profile"
              className="profile-pic"
              onError={e => { e.target.src = '/default-user.png'; }}
            />
            {/* Future: Upload button here */}
          </div>
        </div>
        <div className="profile-details-section">
          <h2>{profile.first_name} {profile.last_name}</h2>
          <div className="profile-detail-row"><span>Email:</span> {profile.email}</div>
          <div className="profile-detail-row"><span>Phone:</span> {profile.phone || '—'}</div>
          <div className="profile-detail-row"><span>Location:</span> {profile.location || '—'}</div>
          <div className="profile-detail-row"><span>Username:</span> {profile.username}</div>
          <div className="profile-detail-row"><span>Role:</span> {profile.role}</div>
          <div className="profile-detail-row"><span>Joined:</span> {profile.created_at && new Date(profile.created_at).toLocaleDateString()}</div>
        </div>
      </div>
      <div className="adopted-pets-section">
        <h3>Adopted Pets</h3>
        {adoptedPets.length === 0 ? (
          <div className="no-adopted-pets">No adopted pets yet.</div>
        ) : (
          <div className="adopted-pets-list">
            {adoptedPets.map(pet => (
              <div key={pet.id} className="adopted-pet-card">
                <img
                  src={pet.image_path ? getImageUrl(pet.image_path) : '/default-pet.png'}
                  alt={pet.name}
                  className="adopted-pet-image"
                  onError={e => { e.target.src = '/default-pet.png'; }}
                />
                <div className="adopted-pet-info">
                  <div className="adopted-pet-name">{pet.name}</div>
                  <div className="adopted-pet-breed">{pet.breed} • {pet.type}</div>
                  <div className="adopted-pet-age">{pet.age} years old</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile; 