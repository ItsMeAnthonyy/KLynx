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

export const getAnimalBiteByVisitId = async (visitId) => {
    try {
        const response = await axios.get('http://localhost/api/get_animal_bite_by_visit_id.php', {
            params: { visit_id: visitId },
            //withCredentials: true,
        });

        return response.data; // { success: true, data: [...] }
    } catch (error) {
        console.error('Error fetching animal bite data:', error);
        return { success: false, error: error.message };
    }
}