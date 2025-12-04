import axios from "axios";

export const saveVitalSigns = async (vitalData) => {
    try {
        console.log("Saving vital signs:", vitalData);
        const { data } = await axios.post("http://localhost/api/save_vital_signs.php", vitalData);

        if (!data.success) throw new Error(data.message);
        console.log(data.vitalId);
        //return data.vital_id; // return inserted row ID
    } catch (error) {
        console.error("Error saving vital signs:", error);
        throw error;
    }
}