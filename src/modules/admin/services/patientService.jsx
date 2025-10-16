import { getPatientById } from "../api/patientApi";

export const fetchPatientData = async (patientId) => {
    try {
        const response = await getPatientById(patientId);
        return response.data; // cleaned response
    } catch (error) {
        console.error("Error fetching patient:", error);
        throw error;
    }
}