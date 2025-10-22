import { getPatientById } from "../api/patientApi";
import { createPatientData } from "../api/patientApi";


export const fetchPatientData = async (patientId) => {
    try {
        const response = await getPatientById(patientId);
        return response.data; // cleaned response
    } catch (error) {
        console.error("Error fetching patient:", error);
        throw error;
    }
}

export const submitPatientData = async (patientFormData) => {
    /*const submissionData = {
        ...formData,
        date: formData.date ? format(formData.date, "MM/dd/yyyy") : "",
    };*/
    
    try{
        // ✅ Send to backend
        const response = await createPatientData(patientFormData);
        return response.data;
    }catch(error){
        console.error("Error fetching patient:", error);
        throw error;
    }

}