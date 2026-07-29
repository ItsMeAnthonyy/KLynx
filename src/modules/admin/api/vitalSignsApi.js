import axios from "axios";
const BASE_URL = "http://localhost/api/vital_signs";

export const saveVitalSigns = async (vitalData) => {
    try {
        console.log("Saving vital signs:", vitalData);
        const { data } = await axios.post("http://localhost/api/save_vital_signs.php", vitalData);

        if (!data.success) throw new Error(data.message);
        console.log(data.vitalId);
        //return data.vital_id; // return inserted row ID
    } catch (error) {
        console.error("Error saving vital signs:", error);
        throw error;
    }
}

export const getVitalSignsByVisitId = async (visitId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/get_by_id.php`, 
            {
                params: { visit_id: visitId },
                withCredentials: true,
            }
        );

        console.log("Data Returned: ", response.data.data);
        return response.data; // { success: true, data: [...] }

    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch vital sign data";

        throw new Error(message);
    }
}

export const updateVitalSign = async (data) => {
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
            "Failed to update vital sign data";

        throw new Error(message);
    }
};