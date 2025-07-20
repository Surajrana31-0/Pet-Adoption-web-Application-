import React, { useState, useEffect, useContext } from 'react'
import { Heart, Clock, CheckCircle, LogOut, Settings as SettingsIcon, Star, Edit2, PawPrint } from 'lucide-react';
import { User as UserIcon } from 'lucide-react';
import { AuthContext } from '../AuthContext.jsx'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/AdopterDashboard.css'
import api, { getImageUrl } from "../services/api";
import { useToast } from '../components/ToastContext';
import MyProfile from './MyProfile.jsx';
import DialogueBox from '../components/DialogueBox.jsx';


const TABS = [
  { key: 'applications', label: 'My Applications', icon: <PawPrint size={18} /> },
  { key: 'favorites', label: 'My Favorites', icon: <Star size={18} /> },
  { key: 'viewPets', label: 'View Pets', icon: <UserIcon size={18} /> },
  { key: 'profile', label: 'My Profile', icon: <Edit2 size={18} /> },
  { key: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
];

const AdopterDashboard = () => {
  const { user, token, role, isAuthenticated, logout } = useContext(AuthContext)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const [pets, setPets] = useState([])
  const [petSearch, setPetSearch] = useState('')
  const [petsLoading, setPetsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('applications')
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' })
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoriteSearch, setFavoriteSearch] = useState("");
  const [adoptError, setAdoptError] = useState("");
  const addToast = useToast();
  const [sidebarProfile, setSidebarProfile] = useState({ username: '', image_path: '' });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    api.get('/users/profile').then(res => {
      setSidebarProfile({
        username: res.data.profile.username || '',
        image_path: res.data.profile.image_path || '',
      });
    }).catch(() => {
      setSidebarProfile({ username: user?.username || '', image_path: '' });
    });
  }, [user]);

  // Tab state from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['applications', 'favorites', 'viewPets', 'profile', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else {
      setActiveTab('applications');
    }
  }, [location.search]);

  // Tab change handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard?tab=${tab}`);
  };

  // Fetch pets when 'View Pets' tab is active
  useEffect(() => {
    if (activeTab === 'viewPets') {
      setPetsLoading(true);
      api.get('/pets').then(res => {
        setPets(res.data.data || []);
        setPetsLoading(false);
      }).catch((error) => {
        console.error('Error fetching pets:', error);
        setPetsLoading(false);
      });
    }
  }, [activeTab]);

  // Fetch applications from backend
  const fetchApplications = async () => {
    try {
      const response = await api.get("/adoptions");
      setApplications(response.data.data || []);
    } catch (error) {
      setError('Failed to load your applications. Please try again later.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    setFavoritesLoading(true);
    try {
      const response = await api.get("/favorites");
      setFavorites(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      setFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Check if pet is in favorites
  const isPetInFavorites = (petId) => {
    return favorites.some(fav => fav.pet_id === petId || fav.id === petId);
  };

  // Add to favorites handler
  const handleAddToFavorites = async (petId) => {
    try {
      await api.post(`/favorites/${petId}`);
      addToast('Pet added to favorites successfully!', 'success');
      // Refresh favorites list
      fetchFavorites();
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      if (error.response?.status === 409) {
        addToast('This pet is already in your favorites!', 'warning');
      } else {
        addToast('Failed to add pet to favorites. Please try again.', 'error');
      }
    }
  };

  // Remove from favorites handler
  const handleRemoveFavorite = async (petId) => {
    try {
      await api.delete(`/favorites/${petId}`);
      addToast('Pet removed from favorites successfully!', 'success');
      // Refresh favorites list
      fetchFavorites();
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      addToast('Failed to remove pet from favorites. Please try again.', 'error');
    }
  };

  // Fetch favorites when 'favorites' tab is active
  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavorites();
    }
  }, [activeTab]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
      case 'PENDING':
        return <Clock className="status-icon pending" />
      case 'approved':
      case 'APPROVED':
        return <CheckCircle className="status-icon approved" />
      case 'rejected':
      case 'REJECTED':
        return <Heart className="status-icon rejected" />
      default:
        return <Clock className="status-icon pending" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
      case 'PENDING':
        return 'Under Review'
      case 'approved':
      case 'APPROVED':
        return 'Approved'
      case 'rejected':
      case 'REJECTED':
        return 'Not Selected'
      default:
        return 'Under Review'
    }
  }



  // Defensive filtering
  const filteredPets = Array.isArray(pets)
    ? pets.filter(pet => {
        const q = petSearch.toLowerCase();
        return (
          pet.name?.toLowerCase().includes(q) ||
          pet.breed?.toLowerCase().includes(q) ||
          pet.type?.toLowerCase().includes(q)
        );
      })
    : [];

  const filteredFavorites = Array.isArray(favorites)
    ? favorites.filter(pet => {
        const q = favoriteSearch.toLowerCase();
        return (
          pet.name?.toLowerCase().includes(q) ||
          pet.breed?.toLowerCase().includes(q) ||
          pet.type?.toLowerCase().includes(q)
        );
      })
    : [];

  // Logout handler
  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  const confirmLogout = () => {
    logout();
    navigate('/login');
    window.location.reload();
  };

  // Tab content renderers
  const renderApplications = () => (
    <div className="tab-content">
      <div className="tab-header-row">
        <h2>My Adoption Applications</h2>
      </div>
      {error ? (
        <div className="error-message">{error}</div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <Heart className="empty-icon" />
          <h3>No Applications Yet</h3>
          <p>You haven't submitted any adoption applications yet.</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map(application => (
            <div key={application.id} className="application-card">
              <img 
                src={getImageUrl(application.Pet?.image_path)}
                alt={application.Pet?.name}
                className="application-pet-image"
                onError={e => { e.target.src = 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300'; }}
              />
              <div className="application-info">
                <h3>{application.Pet?.name}</h3>
                <p>{application.Pet?.breed} • {application.Pet?.type}</p>
                <div className="application-status">
                  {getStatusIcon(application.status)}
                  <span className={`status-text ${application.status}`}>{getStatusText(application.status)}</span>
                </div>
                <p className="application-date">Submitted: {new Date(application.created_at).toLocaleDateString()}</p>
                {application.status === 'APPROVED' && (
                  <div className="approval-message">
                    <CheckCircle className="approval-icon" />
                    <span>{application.Pet?.name} is approved, you can further go for payment process</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderFavorites = () => (
    <div className="tab-content">
      <div className="tab-header-row">
        <h2>My Favorite Pets</h2>
        <div className="favorite-search-container">
          <input
            type="text"
            placeholder="Search favorites by name, breed, or type..."
            value={favoriteSearch}
            onChange={e => setFavoriteSearch(e.target.value)}
            className="favorite-search-input"
          />
        </div>
      </div>
      {favoritesLoading ? (
        <div className="loading">Loading favorites...</div>
      ) : filteredFavorites.length === 0 ? (
        <div className="empty-state">
          <Star className="empty-icon" />
          <h3>No Favorites Yet</h3>
          <p>You haven't added any pets to your favorites yet.</p>
        </div>
      ) : (
        <div className="favorites-list">
          {filteredFavorites.map(pet => (
            <div key={pet.id} className="favorite-card">
              <img 
                src={getImageUrl(pet.image_path)}
                alt={pet.name}
                className="favorite-pet-image"
                onError={e => {
                  e.target.src = 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300';
                }}
              />
              <div className="favorite-info">
                <h3>{pet.name}</h3>
                <p>{pet.breed} • {pet.type}</p>
                <p className="pet-age">{pet.age} years old</p>
              </div>
              <button className="btn-secondary remove-btn" onClick={() => handleRemoveFavorite(pet.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderViewPets = () => (
    <div className="tab-content">
      <div className="tab-header-row">
        <h2>Available Pets for Adoption</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search pets by name, breed, or type..."
            value={petSearch}
            onChange={(e) => setPetSearch(e.target.value)}
            className="pet-search-input"
          />
        </div>
      </div>
      {adoptError && <div className="adopt-error-message">{adoptError}</div>}
      {petsLoading ? (
        <div className="loading">Loading pets...</div>
      ) : (
        <div className="pets-grid">
          {filteredPets.length === 0 ? (
            <div className="no-pets">
              <Heart className="empty-icon" />
              <h3>No pets found</h3>
              <p>{pets.length === 0 ? 'No pets available at the moment.' : 'No pets match your search criteria.'}</p>
            </div>
          ) : (
            filteredPets.map(pet => {
              const unavailable = ["Adopted", "Pending"].includes(pet.status);
              return (
                <div key={pet.id} className="pet-card">
                  <img 
                    src={getImageUrl(pet.image_path)}
                    alt={pet.name}
                    className="pet-image" 
                    onError={e => { e.target.src = 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300'; }}
                  />
                  <div className="pet-info">
                    <h3>{pet.name}</h3>
                    <p className="pet-breed">{pet.breed} • {pet.type}</p>
                    <p className="pet-age">{pet.age} years old</p>
                    <div className="pet-card-actions">
                      <button 
                        className="btn-secondary" 
                        onClick={() => navigate(`/pet/${pet.id}`)}
                      >
                        Details
                      </button>
                      <button 
                        className={`btn-secondary ${isPetInFavorites(pet.id) ? 'favorited' : ''}`}
                        onClick={() => isPetInFavorites(pet.id) ? handleRemoveFavorite(pet.id) : handleAddToFavorites(pet.id)}
                      >
                        <Heart size={16} style={{ marginRight: '4px' }} />
                        {isPetInFavorites(pet.id) ? 'Remove' : 'Favorite'}
                      </button>
                      <button 
                        className="btn-primary" 
                        onClick={async () => {
                          setAdoptError("");
                          if (unavailable) return;
                          try {
                            navigate(`/adopt/${pet.id}`);
                          } catch (err) {
                            setAdoptError("This pet is already adopted or pending adoption");
                          }
                        }}
                        disabled={unavailable}
                      >
                        Adopt
                      </button>
                      {unavailable && (
                        <span className="pet-unavailable-msg">Not available for adoption</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}    
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="tab-content">
      <MyProfile />
    </div>
  )

  const renderSettings = () => (
    <div className="tab-content">
      <div className="tab-header-row">
        <h2>Settings</h2>
      </div>
      <div className="settings-container">
        <div className="settings-card">
          <div className="settings-icon">
            <UserIcon size={48} />
          </div>
          <h3>Profile Management</h3>
          <p>Update your personal information and profile picture</p>
          <button 
            className="btn-primary edit-profile-btn" 
            onClick={() => navigate('/edit-profile')}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="adopter-dashboard-root">
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="profile-pic-placeholder">
            {sidebarProfile.image_path ? (
              <img
                src={getImageUrl(sidebarProfile.image_path)}
                alt="Profile"
                className="sidebar-profile-pic"
                onError={e => { e.target.src = '/default-user.png'; }}
              />
            ) : (
              <img
                src={'/default-user.png'}
                alt="Profile"
                className="sidebar-profile-pic"
              />
            )}
          </div>
          <div className="profile-details" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: 'row' }}>
            <UserIcon size={20} color="#40916c" style={{ flexShrink: 0 }} />
            <span className="profile-name">{sidebarProfile.username}</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`sidebar-link${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
          <button className="sidebar-link logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      <main className="dashboard-main-content">
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'favorites' && renderFavorites()}
        {activeTab === 'viewPets' && renderViewPets()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'settings' && renderSettings()}
      </main>
      <DialogueBox
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        type="info"
        actions={[
          { label: 'Cancel', onClick: () => setShowLogoutModal(false), style: { background: '#e0e0e0', color: '#333' } },
          { label: 'Logout', onClick: confirmLogout, style: { background: '#ff914d', color: '#fff' } },
        ]}
      />
    </div>
  )
}

export default AdopterDashboard