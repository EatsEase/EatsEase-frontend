import axios from "axios";

export const homeScreenData = async (username: string) => {
  try {
    if (!username) {
      throw new Error("Username is required for fetching menu data.");
    }

    console.log(`Fetching menu data for: ${username}`); // Debugging

    const response = await axios.get(`https://eatsease-backend-1jbu.onrender.com/api/recommendation/menu/${username}`);

    console.log('API Response:', response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return []; // คืนค่า array ว่างถ้า error
  }
};