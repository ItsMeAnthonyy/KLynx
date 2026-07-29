import axios from "axios";
const BASE_URL = "http://localhost/api/prenatal_records";

export const createPrenatalRecord = async (visitId, prenatalData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/create.php`,
            {
                visitId,
                ...prenatalData
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
            "Failed to create prenatal record";

        throw new Error(message);
    }
};

export const getPrenatalRecordByVisitId = async (visitId) => {
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
            "Failed to fetch prenatal record";

        throw new Error(message);
    }
};

export const updatePrenatalRecord = async (data) => {
    try {
        console.log("What data sent? ", data);
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
            "Failed to update prenatal record";

        throw new Error(message);
    }
};