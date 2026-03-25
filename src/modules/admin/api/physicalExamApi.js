import axios from "axios";

export const getPhysicalExamByVisitId = async (visitId) => {
    try {
        const response = await axios.get('http://localhost/api/get_physical_exam_by_visit_id.php', {
            params: { visit_id: visitId },
            //withCredentials: true,
        });

        return response.data; // { success: true, data: [...] }
    } catch (error) {
        console.error('Error fetching prenatal data:', error);
        return { success: false, error: error.message };
    }
}