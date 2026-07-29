import axios from "axios";
const BASE_URL = "http://localhost/api/animal_bites";

export const createAnimalBiteRecord = async (visitId, animalBiteData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/create.php`,
            {
                visitId,
                ...animalBiteData
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
            "Failed to create animal bite record";

        throw new Error(message);
    }
};

export const getAnimalBiteByVisitId = async (visitId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/get_by_id.php`,
            {
                params: { visit_id: visitId },
                withCredentials: true,
            }
        );

        return response.data;

    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch animal bite record";

        throw new Error(message);
    }
}

export const updateAnimalBiteRecord = async (data) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/update.php`,
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
            "Failed to update animal bite record";

        throw new Error(message);
    }
};