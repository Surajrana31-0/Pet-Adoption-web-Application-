import React, { useEffect, useState, useCallback } from 'react';
import '../styles/ManageAdoptions.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = '/api/adoptions/admin';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function ManageAdoptions() {
  const [adoptions, setAdoptions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAdoptions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Could not load adoptions');
      console.log('Adoptions data received:', data.data);
      setAdoptions(Array.isArray(data.data) ? data.data : []);
      setFiltered(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdoptions();
  }, [fetchAdoptions]);

  // Debounced search/filter
  useEffect(() => {
    const debounced = debounce((term) => {
      if (!term) {
        setFiltered(adoptions);
        return;
      }
      const lower = term.toLowerCase();
      setFiltered(
        adoptions.filter(a => {
          const userName = a.User ? `${a.User.first_name || ''} ${a.User.last_name || ''}`.toLowerCase() : '';
          const petName = a.Pet ? a.Pet.name.toLowerCase() : '';
          return userName.includes(lower) || petName.includes(lower);
        })
      );
    }, 350);
    debounced(search);
    // eslint-disable-next-line
  }, [search, adoptions]);

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      const res = await fetch(`/api/adoptions/${id}/${action}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${action} adoption`);
      setAdoptions(adoptions.map(a => a.id === id ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' } : a));
      setFiltered(filtered.map(a => a.id === id ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' } : a));
      toast.success(`Adoption ${action === 'approve' ? 'approved' : 'rejected'}!`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="manage-adoptions-main">
      <ToastContainer position="top-center" autoClose={2000} />
      <header className="manage-adoptions-header">
        <h1>Manage Adoptions</h1>
        <input
          type="text"
          placeholder="Search by applicant or pet name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </header>
      {loading ? (
        <div className="loading">Loading adoptions...</div>
      ) : error ? (
        <div className="form-error">{error}</div>
      ) : (
        <div className="adoptions-table-wrapper">
          <table className="adoptions-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Pet</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="5">No adoption applications found.</td></tr>
              ) : (
                filtered.map(adoption => (
                  <tr key={adoption.id}>
                    <td className="adoption-applicant-cell">
                      {adoption.User ? (
                        <>
                          <span className="adoption-user-img-wrapper">
                            {adoption.User.image_path ? (
                              <img
                                src={`http://localhost:5000/uploads/${adoption.User.image_path}`}
                                alt={`${adoption.User.first_name || ''} ${adoption.User.last_name || ''}`}
                                className="adoption-user-img"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'inline-block';
                                }}
                              />
                            ) : (
                              <span className="adoption-user-img adoption-user-img-placeholder">
                                {(adoption.User.first_name || 'U')[0].toUpperCase()}
                              </span>
                            )}
                            <span className="adoption-user-img adoption-user-img-placeholder" style={{ display: 'none' }}>
                              {(adoption.User.first_name || 'U')[0].toUpperCase()}
                            </span>
                          </span>
                          <span className="adoption-user-name">
                            {adoption.User.first_name || 'Unknown'} {adoption.User.last_name || ''}
                          </span>
                        </>
                      ) : (
                        <span className="adoption-user-name">Unknown</span>
                      )}
                    </td>
                    <td className="adoption-pet-cell">
                      {adoption.Pet && adoption.Pet.name ? (
                        <>
                          <span className="adoption-pet-img-wrapper">
                            {adoption.Pet.image_path ? (
                              <img
                                src={`http://localhost:5000/uploads/${adoption.Pet.image_path}`}
                                alt={adoption.Pet.name}
                                className="adoption-pet-img"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'inline-block';
                                }}
                              />
                            ) : (
                              <span className="adoption-pet-img adoption-pet-img-placeholder">?</span>
                            )}
                            <span className="adoption-pet-img adoption-pet-img-placeholder" style={{ display: 'none' }}>?</span>
                          </span>
                          <span className="adoption-pet-name">{adoption.Pet.name}</span>
                        </>
                      ) : (
                        <span className="adoption-pet-name">Unknown</span>
                      )}
                    </td>
                    <td>{adoption.status}</td>
                    <td>{adoption.created_at ? formatDate(adoption.created_at) : ''}</td>
                    <td>
                      {adoption.status === 'pending' ? (
                        <>
                          <button
                            className="approve-btn"
                            disabled={actionLoading === adoption.id + 'approve'}
                            onClick={() => handleAction(adoption.id, 'approve')}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            disabled={actionLoading === adoption.id + 'reject'}
                            onClick={() => handleAction(adoption.id, 'reject')}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className={`adoption-status-label ${adoption.status}`}>{adoption.status}</span>
                      )}
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