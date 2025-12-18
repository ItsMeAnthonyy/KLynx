import axios from 'axios';


export const createPrescription = async (prescriptionData) => {
  try {
    const { data } = await axios.post(
      "http://localhost/api/create_prescription.php",
      prescriptionData
    );

    if (!data.success) throw new Error(data.message || "Failed to create prescription");

  } catch (err) {
    console.error("Prescription API error:", err);
    throw err;
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

export const getPrescriptionsByVisitId = async (visitId) => {
  try {
    const { data } = await axios.post("http://localhost/api/get_prescriptions_by_visit.php", {
      visit_id: visitId
    });

    if (data.success) {
      return data.data; // array of prescriptions
    } else {
      console.error("Failed to fetch prescriptions:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return [];
  }
};