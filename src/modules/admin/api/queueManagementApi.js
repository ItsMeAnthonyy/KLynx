import { DragRotateHandler } from "@maptiler/sdk";
import axios from "axios";



export const createVisitShell = async (visitData) => {
    try{
        console.log("Creating visit shell with data:", visitData);
        const { data } = await axios.post("http://localhost/api/create_visit_shell.php", visitData);
        if (!data.success) throw new Error(data.message);
        return data.visit_id;
    } catch (error) {
        console.error("Error creating visit shell:", error);
        throw error;
    }
};

export const addToQueue = async (queueData) => {
    try {
        console.log("Adding to queue with data:", queueData);
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


export const updateQueueProvider = async (queueId, providerId) => {
  try {
    const { data } = await axios.post(
      'http://localhost/your-php-path/update_queue_provider.php',
      { queue_id: queueId, provider_id: providerId },
      { withCredentials: true }
    );

    if (!data.success) throw new Error(data.message);

    return data.data;
  } catch (error) {
    console.error('Error updating queue provider:', error);
    throw error;
  }
};