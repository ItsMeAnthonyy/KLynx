import axios from "axios";

export const addToQueue = async (queueData) => {
    try {
        const { data } = await axios.post("http://localhost/api/add_to_queue.php", queueData);
        console.log(data.success);

        if (!data.success) throw new Error(data.message || "Failed to add to queue");

    } catch (error) {
        console.error("Error adding to queue:", error);
        throw error;
    }
}

export const getQueue = async (providerId = null, status = null) => {
    try {
        const { data } = await axios.post("http://localhost/api/get_queue.php", {
            provider_id: providerId,
            status: status
        });
        console.log(data);
        if (data.success) return data.data;
        else throw new Error(data.message || "Failed to fetch queue");

    } catch (err) {
        console.error("Queue API error:", err);
        throw err;
    }
};