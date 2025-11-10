import axios from "axios";


export const createPatientVisitData = (patientVisitFormData) => {
    return axios.post("http://localhost/api/Patient_Visits.php", patientVisitFormData);
}

