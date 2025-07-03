import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";

const mockPets = [
  { id: 1, name: "Bella", breed: "Labrador", type: "Dog", age: "2 years", image: "" },
  { id: 2, name: "Milo", breed: "Tabby", type: "Cat", age: "1 year", image: "" },
];

const ManagePets = ({ token }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/admin/pets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch pets");
        const data = await res.json();
        setPets(data);
      } catch {
        setPets(mockPets);
        setError("Could not load pets. Showing mock data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [token]);

  const handleAdd = () => {
    setMessage("Pet added (mock action)");
    setTimeout(() => setMessage(""), 2000);
  };
  const handleEdit = (id) => {
    setMessage("Pet edited (mock action)");
    setTimeout(() => setMessage(""), 2000);
  };
  const handleDelete = (id) => {
    setPets(pets.filter(p => p.id !== id));
    setMessage("Pet deleted (mock action)");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="admin-pets">
      <h2>Manage Pets</h2>
      <button className="admin-action add" onClick={handleAdd}>Add Pet</button>
      {loading ? (
        <div className="admin-loading">Loading pets...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Breed</th>
              <th>Type</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map(pet => (
              <tr key={pet.id}>
                <td>{pet.name}</td>
                <td>{pet.breed}</td>
                <td>{pet.type}</td>
                <td>{pet.age}</td>
                <td>
                  <button className="admin-action edit" onClick={() => handleEdit(pet.id)}>Edit</button>
                  <button className="admin-action delete" onClick={() => handleDelete(pet.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <div className="admin-error-message">{error}</div>}
      {message && <div className="admin-success-message">{message}</div>}
    </div>
  );
};

export default ManagePets; 