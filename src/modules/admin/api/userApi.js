import axios from "axios";
const BASE_URL = "http://localhost/api/users";

export const test = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/test.php`, {
            withCredentials: true
        });
        console.log("ANO BINALIK", response.data);
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to create user account";

        throw new Error(message);
    }
}


export const createUser = async (data) => {
    try {
        console.log("CREATE USER : ", data);
        const response = await axios.post(
            `${BASE_URL}/create.php`,
            data,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            } 
        );

        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to create user account";

        throw new Error(message);
    }
}

export const getUserById = async (userId, view = "summary") => {
    try {
        const response = await axios.get(
            `${BASE_URL}/get_by_id.php`,
            {
                params: { 
                    user_id: userId, 
                    view: view 
                }/*,
                withCredentials: true,*/
            }
        );
        
        return response.data;
        
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch user account";

        throw new Error(message);
    }
};

export const updateProfile = async (data) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/update_admin.php`,
            data,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to update user account";

        throw new Error(message);
    }
};

export const updateStatus = async (userId, newStatus) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/update_status.php`,
            {
                user_id: userId,
                new_status: newStatus
            },
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );
        
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to update user account status";

        throw new Error(message);
    }
};