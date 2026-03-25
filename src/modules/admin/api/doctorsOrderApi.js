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

export const getDoctorsOrderByVisitId = async (visitId) => {
    try {
        const response = await axios.get('http://localhost/api/get_doctors_order_by_visit_id.php', {
            params: { visit_id: visitId },
            //withCredentials: true,
        });

        return response.data; // { success: true, data: [...] }
    } catch (error) {
        console.error('Error fetching prenatal data:', error);
        return { success: false, error: error.message };
    }
}