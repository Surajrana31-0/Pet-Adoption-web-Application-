import React, { useState } from 'react';
import { Mail, Phone, Info, Facebook, Instagram, Twitter } from 'lucide-react';
import '../styles/Contact.css';

const CONTACTS = [
  {
    label: 'Gmail',
    value: 'info@pet_Ey.xs4.com',
    icon: <Mail className="contact-info-icon" />,
    link: 'mailto:petey.adopt@gmail.com',
  },
  {
    label: 'Hotmail',
    value: 'petey@hotmail.com',
    icon: <Mail className="contact-info-icon" />,
    link: 'mailto:petey@hotmail.com',
  },
  {
    label: 'Phone',
    value: '+977-9806464982',
    icon: <Phone className="contact-info-icon" />,
    link: 'tel:+19771234567',
  },
  {
    label: 'Support Email',
    value: 'support@petey.com',
    icon: <Mail className="contact-info-icon" />,
    link: 'mailto:support@petey.com',
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/message/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send message.');
      setSuccess('Message sent successfully!');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-main">
        {/* Left: Info */}
        <div className="contact-content">
          <h1 className="contact-title">Contact PetEy</h1>
          <p className="contact-description">
            <Info style={{ marginRight: 8, verticalAlign: 'middle' }} />
            <span>
              PetEy is dedicated to connecting loving families with pets in need. Our platform streamlines the adoption process, making it easy, transparent, and joyful for everyone. Whether you have questions, need support, or want to share your experience, we're here to help you every step of the way. Reach out to us anytime!
            </span>
          </p>
          <div className="contact-info-grid">
            {CONTACTS.map((c, i) => (
              <a href={c.link} className="contact-info-card" key={i} target="_blank" rel="noopener noreferrer">
                {c.icon}
                <div>
                  <div style={{ fontWeight: 600 }}>{c.label}</div>
                  <div>{c.value}</div>
                </div>
              </a>
            ))}
          </div>
          <div className="contact-social-row" style={{ marginTop: '1.5rem', display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
  <span style={{ fontWeight: 600, color: '#e67c52' }}>Follow us:</span>
  <a
    href="https://www.facebook.com/"
    aria-label="Facebook"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Facebook className="contact-info-icon" />
  </a>
  <a
    href="https://www.instagram.com/"
    aria-label="Instagram"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Instagram className="contact-info-icon" />
  </a>
  <a
    href="https://www.twitter.com/"
    aria-label="Twitter"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Twitter className="contact-info-icon" />
  </a>
</div>
        </div>
        {/* Right: Form */}
        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit} autoComplete="on">
            <h2 className="contact-form-title">Contact Us</h2>
            <label>
              Name <span className="required">*</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </label>
            <label>
              Email <span className="required">*</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your email"
                required
              />
            </label>
            <label>
              Message <span className="required">*</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Type your message..."
                rows={5}
                required
              />
            </label>
            {error && <div className="contact-error">{error}</div>}
            {success && <div className="contact-success">{success}</div>}
            <button type="submit" className="contact-submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;