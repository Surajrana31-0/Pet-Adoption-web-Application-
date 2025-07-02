import React, { useState, useEffect, useContext } from 'react'
import { Heart, Clock, CheckCircle, User, Mail, Phone } from 'lucide-react'
import { AuthContext } from '../AuthContext.jsx'
import { adoptionAPI } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import '../styles/AdopterDashboard.css'

const AdopterDashboard = () => {
  const { user, token, role, isAuthenticated } = useContext(AuthContext)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }
    fetchApplications()
  }, [navigate])

  const fetchApplications = async () => {
    try {
      const data = await adoptionAPI.getUserApplications()
      setApplications(data)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="adopter-dashboard-container">
      <h1>Welcome to Your Dashboard!</h1>
      <p>View your favorite pets and adoption status here.</p>
      <div className="adopter-actions">
        <button>My Favorites</button>
        <button>My Adoptions</button>
        {/* Add more user actions as needed */}
      </div>
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1>My Dashboard</h1>
            <p>Welcome back, {user.name}!</p>
          </div>

          <div className="dashboard-content">
            <div className="dashboard-sidebar">
              <div className="profile-card">
                <div className="profile-header">
                  <User className="profile-icon" />
                  <h3>Profile Information</h3>
                </div>
                <div className="profile-info">
                  <div className="info-item">
                    <User className="info-icon" />
                    <span>{user.name}</span>
                  </div>
                  <div className="info-item">
                    <Mail className="info-icon" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <h3>Your Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">{applications.length}</span>
                    <span className="stat-label">Applications</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {applications.filter(app => app.status === 'approved').length}
                    </span>
                    <span className="stat-label">Approved</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-main">
              <div className="applications-section">
                <h2>My Adoption Applications</h2>
                
                {applications.length === 0 ? (
                  <div className="empty-state">
                    <Heart className="empty-icon" />
                    <h3>No Applications Yet</h3>
                    <p>You haven't submitted any adoption applications yet.</p>
                    <a href="/" className="btn btn-primary">Browse Pets</a>
                  </div>
                ) : (
                  <div className="applications-grid">
                    {applications.map(application => (
                      <div key={application.id} className="application-card">
                        <div className="application-header">
                          <img 
                            src={application.pet?.image_url || `https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300`}
                            alt={application.pet?.name}
                            className="application-pet-image"
                          />
                          <div className="application-info">
                            <h3>{application.pet?.name}</h3>
                            <p>{application.pet?.breed}</p>
                            <div className="application-status">
                              {getStatusIcon(application.status)}
                              <span className={`status-text ${application.status}`}>
                                {getStatusText(application.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="application-details">
                          <p><strong>Submitted:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
                          {application.status === 'approved' && (
                            <div className="approval-message">
                              <CheckCircle className="approval-icon" />
                              <span>Congratulations! Your application has been approved. We'll contact you soon to arrange the adoption.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdopterDashboard