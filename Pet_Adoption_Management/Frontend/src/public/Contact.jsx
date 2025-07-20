import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Phone, MapPin, Clock, Send, PawPrint } from 'lucide-react'
import '../styles/Contact.css'

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true)
      setIsSubmitting(false)
      reset()
    }, 1000)
  }

  return (
    <div className="contact-page">
      <div className="contact-main">
        {/* Left: Get in Touch Details */}
        <div className="contact-content">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-description">
            We're here to help you find your perfect pet companion. Whether you have questions about our adoption process, need help with an application, or want to learn more about our available pets, we'd love to hear from you.
          </p>
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <Phone className="contact-info-icon" />
              <div>
                <h3>Phone</h3>
                <p>(555) 123-4567</p>
              </div>
            </div>
            <div className="contact-info-card">
              <Mail className="contact-info-icon" />
              <div>
                <h3>Email</h3>
                <p>info@petadopt.com</p>
              </div>
            </div>
            <div className="contact-info-card">
              <MapPin className="contact-info-icon" />
              <div>
                <h3>Address</h3>
                <p>123 Pet Street<br />Animal City, AC 12345</p>
              </div>
            </div>
            <div className="contact-info-card">
              <Clock className="contact-info-icon" />
              <div>
                <h3>Hours</h3>
                <p>Mon-Fri: 9:00 AM - 6:00 PM<br />Sat-Sun: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Send Us Message Form */}
        <div className="contact-form-container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
            <PawPrint size={56} color="#ff914d" />
          </div>
          <h2 className="contact-form-title">Send us a Message</h2>
          {submitted && (
            <div className="success-message">
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="First name"
                  {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Last name"
                  {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Email address"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email'
                  }
                })}
              />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="Phone number (optional)"
                {...register('phone')}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subject *</label>
              <select
                className={`form-input form-select ${errors.subject ? 'error' : ''}`}
                {...register('subject', { required: 'Please select a subject' })}
              >
                <option value="">Select a subject</option>
                <option value="adoption">Adoption Inquiry</option>
                <option value="application">Application Status</option>
                <option value="general">General Question</option>
                <option value="volunteer">Volunteer Opportunities</option>
                <option value="other">Other</option>
              </select>
              {errors.subject && <span className="form-error">{errors.subject.message}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                className={`form-input form-textarea ${errors.message ? 'error' : ''}`}
                rows="6"
                placeholder="Tell us how we can help you..."
                {...register('message', { required: 'Message is required' })}
              />
              {errors.message && <span className="form-error">{errors.message.message}</span>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary contact-submit"
            >
              <Send className="btn-icon" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact