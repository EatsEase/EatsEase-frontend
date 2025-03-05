import axios from "axios";

const homeScreenData = async () => {
  try {
    const response = await axios.get('https://eatsease-backend-1jbu.onrender.com/api/menu/all');
    return response.data; // Return fetched data
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export default homeScreenData;
