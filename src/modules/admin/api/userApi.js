import axios from "axios";

export const createUser = (role, email, password) => {
    return axios.post("http://localhost/api/users.php", { 
        role, email, password 
    });
}