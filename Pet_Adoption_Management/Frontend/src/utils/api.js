const BASE_URL = 'http://localhost:5000/api';

// Placeholder for API utility functions
export const adoptionAPI = {
  // Get applications for the current user
  getUserApplications: async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/adoptions/user/${userId}`);
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
      const res = await fetch(`${BASE_URL}/adoptions`);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
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
      const res = await fetch(`${BASE_URL}/pets`);
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
      });
      if (!res.ok) throw new Error('Failed to delete pet');
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },
}; 