import axios from "axios";

export const checkToken = async (token: string) => {
    try{
        const response = await axios.get(`https://eatsease-backend-1jbu.onrender.com/api/userProfile/checkToken`, {headers: {authorization: token}})
        if (response.data?.token === "Token Expired"){
            return false
        };
        if (response.data?.token === "Not Expired"){
            return true
        }
    }
    catch (error) {
        console.error("Error checking token:", error);
        // You can choose to return an error or handle it appropriately
        return "Error";
    }
}