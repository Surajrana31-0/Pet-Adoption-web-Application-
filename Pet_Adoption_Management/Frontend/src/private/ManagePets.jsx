import React, { useEffect, useState, useCallback } from 'react';
import '../styles/ManagePets.css';

const API_URL = '/api/pets';

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function ManagePets() {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPets = useCallback(async (searchTerm = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not load pets');
      let petsData = Array.isArray(data.data) ? data.data : [];
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        petsData = petsData.filter(pet =>
          (pet.name && pet.name.toLowerCase().includes(term)) ||
          (pet.breed && pet.breed.toLowerCase().includes(term)) ||
          (pet.type && pet.type.toLowerCase().includes(term))
        );
      }
      setPets(petsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const debounced = debounce(fetchPets, 400);
    debounced(search);
    // eslint-disable-next-line
  }, [search]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleDelete = async (pet) => {
    if (!window.confirm(`Delete pet ${pet.name}?`)) return;
    setActionLoading(pet.id);
    try {
      const res = await fetch(`${API_URL}/${pet.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete pet');
      setPets(pets.filter(p => p.id !== pet.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="manage-pets-main">
      <header className="manage-pets-header">
        <h1>Manage Pets</h1>
        <input
          type="text"
          placeholder="Search by name, breed, or type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <button className="add-pet-btn" onClick={() => window.location.href = '/add-pet'}>Add Pet</button>
      </header>
      {loading ? (
        <div className="loading">Loading pets...</div>
      ) : error ? (
        <div className="form-error">{error}</div>
      ) : (
        <div className="pets-table-wrapper">
          <table className="pets-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Breed</th>
                <th>Type</th>
                <th>Age</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.length === 0 ? (
                <tr><td colSpan="7">No pets found.</td></tr>
              ) : (
                pets.map(pet => (
                  <tr key={pet.id}>
                    <td className="pet-img-cell">
                      {pet.image_path ? (
                        <img
                          src={`http://localhost:5000/${pet.image_path.replace(/\\/g, '/')}`}
                          alt={pet.name}
                          className="pet-img"
                        />
                      ) : (
                        <span className="pet-img pet-img-placeholder">?</span>
                      )}
                    </td>
                    <td>{pet.name}</td>
                    <td>{pet.breed}</td>
                    <td>{pet.type}</td>
                    <td>{pet.age}</td>
                    <td>{pet.status}</td>
                    <td>
                      <button
                        className="delete-btn"
                        disabled={actionLoading === pet.id}
                        onClick={() => handleDelete(pet)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 