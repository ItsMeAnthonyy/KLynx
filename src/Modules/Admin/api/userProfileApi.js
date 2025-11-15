import axios from "axios";

export const createUserProfile = (user_id, firstName, lastName, middleName, suffix) => {
    return axios.post("http://localhost/api/user_profiles.php", { 
        user_id, 
        firstName, 
        lastName, 
        middleName, 
        suffix
    });
}