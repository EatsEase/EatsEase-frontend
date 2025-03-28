import axios from "axios";

const allergiesScreenData = async (token: string) => {
  try {
    const response = await axios.get('https://eatsease-backend-1jbu.onrender.com/api/allergies/all',
      {
        headers: {
          'authorization': token, // Replace token with your actual token variable
          'Content-Type': 'application/json', // Example header; add others as needed
        }
      }
    );
    return response.data; // Return fetched data
  } catch (error) {
    console.error("Error fetching allergies:", error);
    return []; // Return empty array if error occurs
  }
};

export default allergiesScreenData;
