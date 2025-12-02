import axios from "axios";

export const getVisitsByPatientId = async (patientId) => {
    try {
        const response = await axios.get('http://localhost/api/get_visits_by_patient_id.php', {
            params: { patient_id: patientId },
            //withCredentials: true,
        });

        return response.data; // { success: true, data: [...] }
    } catch (error) {
        console.error('Error fetching visits:', error);
        return { success: false, error: error.message };
    }
};

export const createPatientVisitData = (patientVisitFormData) => {
    return axios.post("http://localhost/api/Patient_Visits.php", patientVisitFormData);
}

