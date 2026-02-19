import axios from "axios";

export const createAnimalBite = async (visitId, patientId, animalBiteData) => {
    try {
        const { data } = await axios.post(
            "http://localhost/api/create_animal_bite.php",
            {
                visit_id: visitId,
                patient_id: patientId,
                ...animalBiteData
            }
        );

        if (!data.success) {
            throw new Error(data.errors || "Failed to save animal bite");
        }

        console.log("Animal Bite API Success:", data.success);
        console.log("Animal Bite API Data:", data.data);
        return data.data;
    } catch (err) {
        console.error("Animal Bite API Error:", err.response.data);
        throw err;
    }
};