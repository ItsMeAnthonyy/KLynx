import axios from "axios";

export const getPatientById = async (patientId) => {
    try {
        const response = await axios.get(`http://localhost/api/get_patient_by_id.php`, {
            params: { id: patientId },
            //withCredentials: true, TURNED OFF FOR NOW - BUT SOON THIS IS ON, FOR AUTH CHECKING IN PHP SIDE
        });

        return response.data; // { success: true, data: {...} }
    } catch (error) {
        console.error("Error fetching patient:", error);
        return { success: false, error: error.message };
    }
};

export const createPatientData = (patientFormData) => {
    return axios.post("http://localhost/api/Patient.php", patientFormData);
}

