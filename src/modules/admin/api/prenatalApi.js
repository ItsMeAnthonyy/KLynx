import axios from "axios";

export const createPrenatal = async (visitId, patientId, prenatalData) => {
    try {
        const { data } = await axios.post(
            "http://localhost/api/create_prenatal.php",
            {
                visit_id: visitId,
                patient_id: patientId,
                ...prenatalData
            }
        );

        if (!data.success) {
            throw new Error(data.errors || "Failed to save Prenatal data");
        }

        console.log("Prenatal API Success:", data.success);
        console.log("Prenatal API Data:", data.data);
        return data.data;
    } catch (err) {
        console.error("Prenatal API Error:", err.response.data);
        throw err;
    }
};

export const getPrenatalDataByVisitId = async (visitId) => {
    try {
        const response = await axios.get('http://localhost/api/get_prenatal_data_by_visit_id.php', {
            params: { visit_id: visitId },
            //withCredentials: true,
        });

        return response.data; // { success: true, data: [...] }
    } catch (error) {
        console.error('Error fetching prenatal data:', error);
        return { success: false, error: error.message };
    }
}