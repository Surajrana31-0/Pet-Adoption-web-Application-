import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Users, Heart, PawPrint } from 'lucide-react'
import { petAPI, adoptionAPI } from '../../utils/api'
import PetForm from '../../components/PetForm/PetForm'
import './Dashboard.css'

const AdminDashboard = () => {
  const [pets, setPets] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddPet, setShowAddPet] = useState(false)
  const [editingPet, setEditingPet] = useState(null)
  const [showPetForm, setShowPetForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [petsData, applicationsData] = await Promise.all([
        petAPI.getAllPets(),
        adoptionAPI.getAllApplications()
      ])
      setPets(petsData)
      setApplications(applicationsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await petAPI.deletePet(petId)
        setPets(pets.filter(pet => pet.id !== petId))
      } catch (error) {
        console.error('Error deleting pet:', error)
      }
    }
  }

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      await adoptionAPI.updateApplicationStatus(applicationId, status)
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ))
    } catch (error) {
      console.error('Error updating application status:', error)
    }
  }

  const handlePetFormSuccess = () => {
    fetchData()
    setShowPetForm(false)
    setEditingPet(null)
  }

  const handleEditPet = (pet) => {
    setEditingPet(pet)
    setShowPetForm(true)
  }

  const handleAddPet = () => {
    setEditingPet(null)
    setShowPetForm(true)
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="dashboard admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage pets and adoption applications</p>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <PawPrint className="stat-icon" />
            <div>
              <span className="stat-number">{pets.length}</span>
              <span className="stat-label">Total Pets</span>
            </div>
          </div>
          <div className="stat-card">
            <Heart className="stat-icon" />
            <div>
              <span className="stat-number">{applications.length}</span>
              <span className="stat-label">Applications</span>
            </div>
          </div>
          <div className="stat-card">
            <Users className="stat-icon" />
            <div>
              <span className="stat-number">
                {applications.filter(app => app.status === 'pending').length}
              </span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>

        <div className="admin-sections">
          <div className="admin-section">
            <div className="section-header">
              <h2>Pets Management</h2>
              <button 
                onClick={handleAddPet}
                className="btn btn-primary"
              >
                <Plus />
                Add Pet
              </button>
            </div>

            <div className="pets-grid">
              {pets.map(pet => (
                <div key={pet.id} className="admin-pet-card">
                  <img 
                    src={pet.image_url || `https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300`}
                    alt={pet.name}
                    className="admin-pet-image"
                  />
                  <div className="admin-pet-info">
                    <h3>{pet.name}</h3>
                    <p>{pet.breed}</p>
                    <span className={`status-badge ${pet.status}`}>
                      {pet.status}
                    </span>
                    <div className="admin-pet-actions">
                      <button 
                        onClick={() => handleEditPet(pet)}
                        className="btn btn-outline btn-sm"
                      >
                        <Edit />
                      </button>
                      <button 
                        onClick={() => handleDeletePet(pet.id)}
                        className="btn btn-danger btn-sm"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-section">
            <h2>Adoption Applications</h2>
            
            {applications.length === 0 ? (
              <div className="empty-state">
                <Heart className="empty-icon" />
                <h3>No Applications</h3>
                <p>No adoption applications have been submitted yet.</p>
              </div>
            ) : (
              <div className="applications-list">
                {applications.map(application => (
                  <div key={application.id} className="admin-application-card">
                    <div className="application-header">
                      <img 
                        src={application.pet?.image_url || `https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100`}
                        alt={application.pet?.name}
                        className="application-pet-thumb"
                      />
                      <div className="application-info">
                        <h4>{application.full_name}</h4>
                        <p>Wants to adopt <strong>{application.pet?.name}</strong></p>
                        <small>Submitted: {new Date(application.created_at).toLocaleDateString()}</small>
                      </div>
                      <div className="application-status">
                        <span className={`status-badge ${application.status}`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="application-details">
                      <p><strong>Phone:</strong> {application.phone}</p>
                      <p><strong>Address:</strong> {application.address}</p>
                      <p><strong>Housing:</strong> {application.housing_type}</p>
                      <p><strong>Experience:</strong> {application.experience}</p>
                      <p><strong>Reason:</strong> {application.reason}</p>
                    </div>

                    {application.status === 'pending' && (
                      <div className="application-actions">
                        <button 
                          onClick={() => handleApplicationStatus(application.id, 'approved')}
                          className="btn btn-secondary btn-sm"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleApplicationStatus(application.id, 'rejected')}
                          className="btn btn-danger btn-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pet Form Modal */}
      {showPetForm && (
        <PetForm
          pet={editingPet}
          onClose={() => {
            setShowPetForm(false)
            setEditingPet(null)
          }}
          onSuccess={handlePetFormSuccess}
        />
      )}
    </div>
  )
}

export default AdminDashboard