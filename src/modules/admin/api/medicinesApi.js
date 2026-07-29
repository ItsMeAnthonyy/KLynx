import axios from "axios";
const BASE_URL = "http://localhost/api/medicines";

export const createMedicine = async (medicineData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/create.php`,
            medicineData,
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
            "Failed to create medicine record";

        throw new Error(message);
    }
};

export const getMedicines = async ({
    search = "",
    page = 1,
    limit = 10,
}) => {
    try {
        const response = await axios.get(`${BASE_URL}/get_by_id.php`, {
            params: { 
                search,
                page,
                limit 
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch medicines record";

        throw new Error(message);
    }
};