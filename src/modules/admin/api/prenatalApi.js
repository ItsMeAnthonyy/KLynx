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