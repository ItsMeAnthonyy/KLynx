import axios from "axios";

export const getPatientById = (id) => {

    return alert("Test");

};

export const createPatientData = (patientFormData) => {
    return axios.post("http://localhost/api/Patient.php", patientFormData);
}

