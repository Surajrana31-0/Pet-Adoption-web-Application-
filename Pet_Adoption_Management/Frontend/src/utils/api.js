const BASE_URL = '/api/auth'; // Use relative path for Vite proxy

// Helper to get the JWT token from localStorage
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper to handle 401/403 errors globally
function handleAuthError(res) {
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }
}

export const authAPI = {
  // Login function
  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }
      return await res.json(); // Should contain the token
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  // Request password reset (send reset link to email)
  requestPasswordReset: async (email) => {
    try {
      const res = await fetch(`${BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error('Server error: ' + text);
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to send reset link');
      }
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

export async function requestPasswordReset(username, email) {
  try {
    const res = await fetch(`${BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email })
    });
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      throw new Error('Server error: ' + text);
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send reset link');
    return data;
  } catch (err) {
    console.error('requestPasswordReset error:', err);
    throw err;
  }
}

export async function confirmPasswordReset(username, token, newPassword) {
  try {
    const res = await fetch(`${BASE_URL}/new-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, token, newPassword })
    });
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      throw new Error('Server error: ' + text);
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reset password');
    return data;
  } catch (err) {
    console.error('confirmPasswordReset error:', err);
    throw err;
  }
}

export const adoptionAPI = {
  // Get applications for the current user
  getUserApplications: async () => {
    try {
      const url = `/api/adoptions/user`;
      const headers = {
        ...getAuthHeaders(),
      };
      console.log('[getUserApplications] Request:', { url, headers });
      const res = await fetch(url, { headers });
      handleAuthError(res);
      if (!res.ok) {
        const errorText = await res.text();
        console.error('[getUserApplications] Response error:', errorText);
        throw new Error('Failed to fetch user applications');
      }
      const json = await res.json();
      console.log('[getUserApplications] Response data:', json);
      return json.data;
    } catch (err) {
      console.error('Full API Error:', err);
      return null;
    }
  },
  // Get all adoption applications (admin)
  getAllApplications: async () => {
    try {
      const res = await fetch(`/api/adoptions`, {
        headers: {
          ...getAuthHeaders(),
        },
      });
      handleAuthError(res);
      if (!res.ok) throw new Error('Failed to fetch all applications');
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  // Update application status (admin)
  updateApplicationStatus: async (applicationId, status) => {
    try {
      const res = await fetch(`/api/adoptions/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
      });
      handleAuthError(res);
      if (!res.ok) throw new Error('Failed to update application status');
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },
};

export const petAPI = {
  // Get all pets
  getAllPets: async () => {
    try {
      const res = await fetch(`/api/pets`, {
        headers: {
          ...getAuthHeaders(),
        },
      });
      handleAuthError(res);
      if (!res.ok) throw new Error('Failed to fetch pets');
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  // Delete a pet by ID (admin)
  deletePet: async (petId) => {
    try {
      const res = await fetch(`/api/pets/${petId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
        },
      });
      handleAuthError(res);
      if (!res.ok) throw new Error('Failed to delete pet');
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },
}; 