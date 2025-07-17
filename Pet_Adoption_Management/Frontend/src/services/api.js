import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
