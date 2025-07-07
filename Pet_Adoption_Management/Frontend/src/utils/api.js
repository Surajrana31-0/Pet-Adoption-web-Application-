const BASE_URL = 'http://localhost:5000/api';

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
      const res = await fetch(`${BASE_URL}/auth/login`, {
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
};

export const adoptionAPI = {
  // Get applications for the current user
  getUserApplications: async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/adoptions/user/${userId}`, {
        headers: {
          ...getAuthHeaders(),
        },
      });
      handleAuthError(res);
      if (!res.ok) throw new Error('Failed to fetch user applications');
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  // Get all adoption applications (admin)
  getAllApplications: async () => {
    try {
      const res = await fetch(`${BASE_URL}/adoptions`, {
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
      const res = await fetch(`${BASE_URL}/adoptions/${applicationId}`, {
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
      const res = await fetch(`${BASE_URL}/pets`, {
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
      const res = await fetch(`${BASE_URL}/pets/${petId}`, {
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