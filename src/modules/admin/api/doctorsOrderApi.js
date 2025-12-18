import axios from "axios";


export const createDoctorsOrder = async (visitId, patientId, doctorsOrderData) => {
    try {
        const { data } = await axios.post(
            "http://localhost/api/create_doctors_order.php",
            {
                visit_id: visitId,
                patient_id: patientId,
                ...doctorsOrderData
            }
        );

        if (!data.success) {
            throw new Error(data.message || "Failed to save doctor's order");
        }

        return data.data;
    } catch (err) {
        console.error("Doctors Order API Error:", err);
        throw err;
    }
};
