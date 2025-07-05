import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getUsers = ()=> axios.get(`${API_URL}/users`);
export const getPets = ()=> axios.get(`${API_URL}/pets`);
export const getAdoptions = ()=> axios.get(`${API_URL}/adoptions`);
export const updateUser = (userId, data) => axios.put(`${API_URL}/users/${userId}`, data);
export const deleteUser = (userId) => axios.delete(`${API_URL}/users/${userId}`);
export const addPet = (data) => axios.post(`${API_URL}/pets`, data);    
export const updatePet = (petId, data) => axios.put(`${API_URL}/pets/${petId}`, data);
export const deletePet = (petId) => axios.delete(`${API_URL}/pets/${petId}`);


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
