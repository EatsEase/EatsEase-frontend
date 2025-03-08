import axios from "axios";

const allergiesScreenData = async () => {
  try {
    const response = await axios.get('https://eatsease-backend-1jbu.onrender.com/api/allergies/all');
    return response.data; // Return fetched data
  } catch (error) {
    console.error("Error fetching allergies:", error);
    return []; // Return empty array if error occurs
  }
};

export default allergiesScreenData;
