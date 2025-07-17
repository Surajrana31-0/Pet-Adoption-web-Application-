import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagePets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchPets = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pets', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch pets');
      setPets(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;
    try {
      const res = await fetch(`/api/pets/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete pet');
      setPets(pets.filter((pet) => pet.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="manage-pets-container">
      <div className="manage-pets-header">
        <h2>Manage Pets</h2>
        <button onClick={() => navigate('/add-pet')} className="add-pet-btn">Add Pet</button>
      </div>
      {loading ? (
        <div>Loading pets...</div>
      ) : error ? (
        <div className="form-error">{error}</div>
      ) : (
        <div className="pets-table-wrapper">
          <table className="pets-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Breed</th>
                <th>Type</th>
                <th>Age</th>
                <th>Status</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.length === 0 ? (
                <tr><td colSpan="7">No pets found.</td></tr>
              ) : (
                pets.map((pet) => (
                  <tr key={pet.id}>
                    <td>{pet.name}</td>
                    <td>{pet.breed}</td>
                    <td>{pet.type}</td>
                    <td>{pet.age}</td>
                    <td>{pet.status}</td>
                    <td>
                      {pet.image_path ? (
                        <img
                          src={`http://localhost:5000/${pet.image_path.replace(/\\/g, '/')}`}
                          alt={pet.name}
                          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }}
                        />
                      ) : (
                        <span style={{ color: '#aaa' }}>No image</span>
                      )}
                    </td>
                    <td>
                      {/* <button onClick={() => handleEdit(pet.id)}>Edit</button> */}
                      <button onClick={() => handleDelete(pet.id)} className="delete-btn">Delete</button>
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