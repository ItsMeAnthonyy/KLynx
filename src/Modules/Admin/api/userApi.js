import axios from "axios";

export const createUser = (email, password) => {
    return axios.post("http://localhost/api/users.php", { email, password });
}