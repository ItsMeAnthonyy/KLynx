import axios from 'axios';
const BASE_URL = "http://localhost/api/prescriptions";

export const createPrescription = async (visitId, prescriptionData) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/create.php`, 
            {
                visitId,
                ...prescriptionData
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
            "Failed to create prescription's record";

        throw new Error(message);
    }
};


export const getPrescriptionsByVisitId = async (visitId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/get_by_id.php`,
            {
                params: { visit_id: visitId },
                withCredentials: true,
            }
        );

        return response.data;

    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch prescription's record";

        throw new Error(message);
    }
};


export const updatePrescription = async (id, prescriptionData) => {
  try {
    const { data } = await axios.post(
      "http://localhost/api/update_prescription.php",
      {
        id,               // prescription ID
        ...prescriptionData  // fields to update
      }
    );

    if (!data.success) throw new Error(data.message || "Failed to update prescription");

    return data.data; // Return updated prescription
  } catch (err) {
    console.error("Update Prescription API error:", err);
    throw err;
  }
};
