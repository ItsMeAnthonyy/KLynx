import axios from "axios";

export const getUserById = async (userId) => {
    try {
        console.log("USer ID IN API ", userId);
        const response = await axios.get(`http://localhost/api/get_user_by_id.php`, {
            params: { user_id: userId}
        });

        if (!response.data.success) {
            throw new Error(response.data.message || "Update failed");
        }
        
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateProfile = async (data) => {
    try {
        const response = await axios.post(
            "http://localhost/api/update_profile.php",
            data,
            { 
                withCredentials: true, // important for PHP session
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const res = response.data;
        if (!res || !res.success) {
            throw new Error(res?.message || "Update failed");
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePassword = async (data) => {
    try {
        const response = await axios.post(
            "http://localhost/api/update_password.php",
            {
                current_password: data.currentPassword,
                new_password: data.confirmPassword,  
                confirm_password: data.newPassword,
            },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Password update failed";

        throw new Error(message);
    }
};