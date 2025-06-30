import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { PawPrint, Heart, LogOut } from 'lucide-react';
import '../styles/AdopterDashboard.css';

// Placeholder data for favorites (will be replaced later)
const placeholderFavorites = [
  { id: 1, name: 'Charlie', age: '3 years', species: 'Dog', image: 'https://images.pexels.com/photos/895259/pexels-photo-895259.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, name: 'Whiskers', age: '2 years', species: 'Cat', image: 'https://images.pexels.com/photos/208984/pexels-photo-208984.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const AdopterDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [favorites, setFavorites] = useState(placeholderFavorites);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      setUser(decoded);

      const fetchDashboardData = async () => {
        try {
          // Fetch adoption requests
          const requestsRes = await fetch('http://localhost:5000/api/adoptions', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!requestsRes.ok) throw new Error('Failed to fetch adoption requests');
          const requestsData = await requestsRes.json();
          setRequests(requestsData.data);

          // Fetch favorite pets
          const favoritesRes = await fetch('http://localhost:5000/api/favorites', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!favoritesRes.ok) throw new Error('Failed to fetch favorite pets');
          const favoritesData = await favoritesRes.json();
          setFavorites(favoritesData.data);

        } catch (fetchError) {
          setError('Could not load your data. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchDashboardData();
    } catch (e) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (error) return <div className="dashboard-error">{error}</div>;
  if (isLoading || !user) return <div>Loading...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>
          <PawPrint className="welcome-icon" size={36} />
          Welcome, {user.email.split('@')[0]}!
        </h1>
        <button onClick={handleLogout} className="logout-button">
          <LogOut className="logout-icon" size={20} />
          Logout
        </button>
      </div>

      <section className="dashboard-section">
        <h2>My Adoption Requests</h2>
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Pet</th>
                <th>Date Submitted</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="3">Loading requests...</td></tr>
              ) : requests.length > 0 ? (
                requests.map(req => (
                  <tr key={req.id}>
                    <td>
                      <div className="pet-info">
                        <img src={req.Pet?.image} alt={req.Pet?.name} />
                        <span>{req.Pet?.name || 'Pet not found'}</span>
                      </div>
                    </td>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge status-${req.status}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" style={{ textAlign: 'center' }}>No adoption requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Favorite Pets</h2>
        <div className="favorites-grid">
          {favorites.map(pet => (
            <div key={pet.id} className="pet-card">
              <img src={pet.image} alt={pet.name} className="pet-card-image" />
              <div className="pet-card-content">
                <div className="pet-card-header">
                  <h3>{pet.name}</h3>
                  <Heart className="favorite-icon" size={24} />
                </div>
                <p>{pet.age} • {pet.species}</p>
                <button className="pet-card-button">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdopterDashboard;