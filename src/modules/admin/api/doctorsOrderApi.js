import axios from "axios";
const BASE_URL = "http://localhost/api/doctors_orders";

export const createDoctorOrder = async (visitId, doctorOrderData) => {
    try {
        // const { data } = await axios.post(
        //     "http://localhost/api/create_doctors_order.php",
        //     {
        //         visit_id: visitId,
        //         patient_id: patientId,
        //         ...doctorsOrderData
        //     }
        // );
        console.log("API Check: ", visitId, doctorOrderData);
        const response = await axios.post(
            `${BASE_URL}/create.php`,
            {
                visitId,
                ...doctorOrderData
            },
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to create doctor's order record";

        throw new Error(message);
    }
};

export const getDoctorOrderByVisitId = async (visitId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/get_by_id.php`,
            {
                params: { visit_id: visitId },
                withCredentials: true,
            }
        );
        // const response = await axios.get('http://localhost/api/get_doctors_order_by_visit_id.php', {
        //     params: { visit_id: visitId },
        //     //withCredentials: true,
        // });

        return response.data;

    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch doctor order record";

        throw new Error(message);
    }
};

export const updateDoctorOrderRecord = async (data) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/update.php`,
            data,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );

        console.log("Test", response);
            
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to update doctor order record";

        throw new Error(message);
    }
};