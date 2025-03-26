import axios from "axios";

const preferencesScreenData = async () => {
  try {
    const response = await axios.get('https://eatsease-backend-1jbu.onrender.com/api/category/all');

    console.log(response.data)
    return response.data; // Return fetched data
  } catch (error) {
    console.error(error);
  }
};

export default preferencesScreenData;
