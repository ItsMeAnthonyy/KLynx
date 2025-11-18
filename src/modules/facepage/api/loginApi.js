import axios from "axios";

export const loginUser = (email, password) => {
    return axios.post("http://localhost/api/login.php", 
        { email, password },
        { withCredentials: true }
    );
}