import axios from "axios";

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
        const response = await axios.get('http://localhost/api/get_vital_signs_by_visit_id.php', {
            params: { visit_id: visitId },
            //withCredentials: true,
        });

        return response.data; // { success: true, data: [...] }
    } catch (error) {
        console.error('Error fetching vital signs:', error);
        return { success: false, error: error.message };
    }
}