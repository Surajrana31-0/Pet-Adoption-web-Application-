import React, { useState, useEffect, useContext } from 'react'
import { Heart, Clock, CheckCircle, User, Mail, Phone, LogOut, Settings as SettingsIcon, Star, Edit2, PawPrint } from 'lucide-react'
import { AuthContext } from '../AuthContext.jsx'
import { adoptionAPI } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import '../styles/AdopterDashboard.css'
import Modal from "../components/DialogueBox"
import { petAPI } from '../utils/api'
import AdoptionForm from "./AdoptionForm.jsx";
import api from "../services/api";

// Dummy/mock data for applications and favorites
const mockApplications = [
  {
    id: 1,
    pet: { name: 'Bella', breed: 'Labrador', image_url: '', type: 'Dog' },
    status: 'pending',
    created_at: '2024-05-01T10:00:00Z',
  },
  {
    id: 2,
    pet: { name: 'Milo', breed: 'Tabby', image_url: '', type: 'Cat' },
    status: 'approved',
    created_at: '2024-04-15T14:30:00Z',
  },
];
const mockFavorites = [
  {
    id: 1,
    name: 'Charlie',
    breed: 'Golden Retriever',
    image_url: '',
    type: 'Dog',
    age: '2 years',
  },
  {
    id: 2,
    name: 'Luna',
    breed: 'Siamese',
    image_url: '',
    type: 'Cat',
    age: '1 year',
  },
];

const TABS = [
  { key: 'applications', label: 'My Applications', icon: <PawPrint size={18} /> },
  { key: 'favorites', label: 'My Favorites', icon: <Star size={18} /> },
  { key: 'viewPets', label: 'View Pets', icon: <User size={18} /> },
  { key: 'profile', label: 'My Profile', icon: <Edit2 size={18} /> },
  { key: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
];

const AdopterDashboard = () => {
  const { user, token, role, isAuthenticated } = useContext(AuthContext)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [showBrowsePets, setShowBrowsePets] = useState(false)
  const [pets, setPets] = useState([])
  const [petSearch, setPetSearch] = useState('')
  const [petsLoading, setPetsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('applications')
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' })
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState(null);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showPetDescription, setShowPetDescription] = useState(false);
  const [petDescription, setPetDescription] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  // Fetch pets when 'View Pets' tab is active
  useEffect(() => {
    if (activeTab === 'viewPets') {
      setPetsLoading(true);
      petAPI.getAllPets().then(res => {
        // Accept both array and object with data property
        const petList = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : res.data?.data || []);
        setPets(petList);
        setPetsLoading(false);
      }).catch(() => setPetsLoading(false));
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

  // Add to favorites handler
  const handleAddToFavorites = async (petId) => {
    try {
      await api.post(`/favorites/${petId}`);
      // Refresh favorites list
      fetchFavorites();
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    }
  };

  // Remove from favorites handler
  const handleRemoveFavorite = async (petId) => {
    try {
      await api.delete(`/favorites/${petId}`);
      // Refresh favorites list
      fetchFavorites();
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
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
        return <Clock className="status-icon pending" />
      case 'approved':
        return <CheckCircle className="status-icon approved" />
      case 'rejected':
        return <Heart className="status-icon rejected" />
      default:
        return <Clock className="status-icon pending" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Under Review'
      case 'approved':
        return 'Approved'
      case 'rejected':
        return 'Not Selected'
      default:
        return 'Under Review'
    }
  }

  const openBrowsePets = async () => {
    setShowBrowsePets(true);
    setPetsLoading(true);
    try {
      const data = await petAPI.getAllPets();
      // Defensive: handle array or object with data property
      const petList = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      setPets(petList);
    } catch (e) {
      setPets([]); // Always set to an array on error
    } finally {
      setPetsLoading(false);
    }
  };

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

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  // Tab content renderers
  const renderApplications = () => (
    <div className="tab-content">
      <div className="tab-header-row">
        <h2>My Adoption Applications</h2>
        <button className="btn-primary" onClick={openBrowsePets}>Browse Pets</button>
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
                src={application.pet?.image_url || `https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300`}
                alt={application.pet?.name}
                className="application-pet-image"
              />
              <div className="application-info">
                <h3>{application.pet?.name}</h3>
                <p>{application.pet?.breed} • {application.pet?.type}</p>
                <div className="application-status">
                  {getStatusIcon(application.status)}
                  <span className={`status-text ${application.status}`}>{getStatusText(application.status)}</span>
                </div>
                <p className="application-date">Submitted: {new Date(application.created_at).toLocaleDateString()}</p>
                {application.status === 'approved' && (
                  <div className="approval-message">
                    <CheckCircle className="approval-icon" />
                    <span>Congratulations! Your application has been approved.</span>
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
      </div>
      {favoritesLoading ? (
        <div className="loading">Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div className="empty-state">
          <Star className="empty-icon" />
          <h3>No Favorites Yet</h3>
          <p>You haven't added any pets to your favorites yet.</p>
        </div>
      ) : (
        <div className="favorites-list">
          {favorites.map(pet => (
            <div key={pet.id} className="favorite-card">
              <img src={pet.image_url || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300'} alt={pet.name} className="favorite-pet-image" />
              <div className="favorite-info">
                <h3>{pet.name}</h3>
                <p>{pet.breed} • {pet.type}</p>
                <p>{pet.age}</p>
                <button className="btn-secondary" onClick={() => handleRemoveFavorite(pet.id)}>Remove</button>
              </div>
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
      </div>
      {petsLoading ? (
        <div className="loading">Loading pets...</div>
      ) : (
        <div className="pets-grid">
          {pets.length === 0 ? (
            <div className="no-pets">No pets available.</div>
          ) : (
            pets.map(pet => (
              <div key={pet.id} className="pet-card">
                <img src={pet.image_url || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300'} alt={pet.name} className="pet-image" />
                <div className="pet-info">
                  <h3>{pet.name}</h3>
                  <p>{pet.breed} • {pet.type}</p>
                  <p>{pet.age}</p>
                  <div className="pet-card-actions">
                    <button className="btn-secondary" onClick={() => { setPetDescription(pet); setShowPetDescription(true); }}>Description</button>
                    <button className="btn-secondary" onClick={() => handleAddToFavorites(pet.id)}>Add to Favorites</button>
                    <button className="btn-primary" onClick={() => { setSelectedPet(pet); setShowAdoptionForm(true); }}>Adopt</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Pet Description Modal */}
      {showPetDescription && petDescription && (
        <Modal onClose={() => setShowPetDescription(false)}>
          <div className="pet-description-modal">
            <h2>{petDescription.name}</h2>
            <img src={petDescription.image_url || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300'} alt={petDescription.name} className="pet-image-modal" />
            <p><strong>Breed:</strong> {petDescription.breed}</p>
            <p><strong>Type:</strong> {petDescription.type}</p>
            <p><strong>Age:</strong> {petDescription.age}</p>
            <p><strong>Description:</strong> {petDescription.description}</p>
            <button className="btn-primary" onClick={() => setShowPetDescription(false)}>Close</button>
          </div>
        </Modal>
      )}
      {/* Adoption Form Modal */}
      {showAdoptionForm && selectedPet && (
        <AdoptionForm
          pet={selectedPet}
          onClose={() => setShowAdoptionForm(false)}
          onSuccess={() => { setShowAdoptionForm(false); fetchApplications(); }}
        />
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="tab-content">
      <div className="tab-header-row">
        <h2>My Profile</h2>
        {!editing ? (
          <button className="btn-primary" onClick={() => setEditing(true)}>Edit</button>
        ) : (
          <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
        )}
      </div>
      <form className="profile-form" onSubmit={e => { e.preventDefault(); setEditing(false); }}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={profile.name} disabled={!editing} onChange={e => setProfile({ ...profile, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={profile.email} disabled={!editing} onChange={e => setProfile({ ...profile, email: e.target.value })} />
        </div>
        {editing && <button className="btn-primary" type="submit">Save</button>}
      </form>
    </div>
  )

  const renderSettings = () => (
    <div className="tab-content">
      <div className="tab-header-row">
        <h2>Settings</h2>
      </div>
      <div className="settings-placeholder">
        <p>Change password and notification preferences coming soon!</p>
        <button className="btn-primary" style={{marginTop: '1.5rem'}} onClick={() => navigate('/profile')}>
          Edit Profile
        </button>
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
            <User size={48} />
          </div>
          <div className="profile-details">
            <span className="profile-name">{user?.name}</span>
            <span className="profile-email">{user?.email}</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`sidebar-link${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
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
      {/* Browse Pets Modal */}
      {showBrowsePets && (
        <Modal onClose={() => setShowBrowsePets(false)}>
          <div className="browse-pets-modal">
            <h2>Browse Pets</h2>
            <input
              type="text"
              placeholder="Search by name, breed, or type..."
              value={petSearch}
              onChange={e => setPetSearch(e.target.value)}
              className="pet-search-input"
            />
            {petsLoading ? (
              <div className="loading">Loading pets...</div>
            ) : (
              <div className="pets-grid-modal">
                {filteredPets.length === 0 ? (
                  <div className="no-pets">No pets found.</div>
                ) : (
                  filteredPets.map(pet => (
                    <div key={pet.id} className="pet-card-modal">
                      <img src={pet.image || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300'} alt={pet.name} className="pet-image-modal" />
                      <div className="pet-info-modal">
                        <h3>{pet.name}</h3>
                        <p>{pet.breed} • {pet.type}</p>
                        <p>{pet.age}</p>
                        <p className="pet-desc-modal">{pet.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default AdopterDashboard