import axios from "axios";

const API_URL = "/api";
const BASE_URL = "http://localhost:5000";

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Utility function to get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  // If imagePath already starts with 'uploads/', remove it
  let cleanPath = imagePath;
  if (cleanPath.startsWith('uploads/')) {
    cleanPath = cleanPath.replace(/^uploads\//, '');
  }
  // If imagePath starts with a backslash (Windows), remove it
  if (cleanPath.startsWith('uploads\\')) {
    cleanPath = cleanPath.replace(/^uploads\\/, '');
  }
  // If imagePath contains any slashes, just use the last part (filename)
  if (cleanPath.includes('/') || cleanPath.includes('\\')) {
    cleanPath = cleanPath.split(/[/\\]/).pop();
  }
  return `${BASE_URL}/uploads/${cleanPath}`;
};

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    // Skip authentication for public endpoints
    const publicEndpoints = ['/pets', '/pets/'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url.startsWith(endpoint) && config.method === 'get'
    );
    
    if (!isPublicEndpoint) {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;


// export const fetchPets = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/pets`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching pets:", error);
//     throw error;
//   }
// };

// export const adoptPet = async (petId) => {
//   try {
//     const response = await axios.post(`${API_URL}/pets/adopt`, { petId });
//     return response.data;
//   } catch (error) {
//     console.error("Error adopting pet:", error);
//     throw error;
//   }
// };
