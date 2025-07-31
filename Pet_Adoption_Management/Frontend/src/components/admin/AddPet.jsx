import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddPet.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  name: '',
  breed: '',
  type: 'Dog',
  age: '',
  description: '',
  status: 'Available',
};

const typeOptions = ['Dog', 'Cat', 'Other'];
const statusOptions = ['Available', 'Adopted', 'Pending'];

export default function AddPet() {
  console.log('AddPet component rendered');
  const [form, setForm] = useState(initialState);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const validate = () => {
    if (!form.name.trim() || !form.breed.trim() || !form.type || !form.age) {
      setError('Name, Breed, Type, and Age are required.');
      toast.error('Name, Breed, Type, and Age are required.');
      return false;
    }
    if (isNaN(form.age) || Number(form.age) <= 0) {
      setError('Age must be a positive number.');
      toast.error('Age must be a positive number.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (image) formData.append('image', image);
      const res = await fetch('/api/pets', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || (data.errors && data.errors[0]?.msg) || 'Failed to add pet');
      toast.success('Pet added successfully!');
      setTimeout(() => navigate('/admin'), 1200);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-pet-container">
      <ToastContainer position="top-center" autoClose={2000} />
      <h2>Add New Pet</h2>
      <form className="add-pet-form" onSubmit={handleSubmit}>
        <label>Name*<input type="text" name="name" value={form.name} onChange={handleChange} required /></label>
        <label>Breed*<input type="text" name="breed" value={form.breed} onChange={handleChange} required /></label>
        <label>Type*
          <select name="type" value={form.type} onChange={handleChange} required>
            {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>
        <label>Age*<input type="number" name="age" value={form.age} onChange={handleChange} min="1" required /></label>
        <label>Description
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </label>
        <label>Status*
          <select name="status" value={form.status} onChange={handleChange} required>
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </label>
        <label>Image
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        {preview && <img src={preview} alt="Preview" className="pet-image-preview" />}
        {error && <div className="form-error">{error}</div>}
        <div className="form-actions">
          <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Pet'}</button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/admin')}>Cancel</button>
        </div>
      </form>
    </div>
  );
} 