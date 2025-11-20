import axios from "axios";

export const getPatients = async (includeArchived = false) => {
    try {
        const response = await axios.get("http://localhost/api/get_patients.php", {
            params: {
                includeArchived: includeArchived ? 1 : 0
            }
        });
        return response.data; // returns array of patients

    } catch (error) {
        console.error("Error fetching patients:", error);
        return [];
    }
}

export const getProviders = async () => {
    try {
        const response = await axios.get("http://localhost/api/get_providers.php");
        return response.data; // returns array of patients
    } catch (error) {
        console.error("Error fetching providers:", error);
        return [];
    }
}

export const createAppointment = async (appointmentData) => {
    try {
        const response = await axios.post(
            "http://localhost/api/create_appointment.php",
            appointmentData
        );
    } catch (error) {
        console.error("Error creating appointment:", error);
        throw error;
    }
}

export const getAppointments = async (startDate, endDate, providerId = null) => {
    try {
        const response = await axios.get("http://localhost/api/get_appointments.php", {
            params: { startDate, endDate, providerId }
        });

        // Flatten patient and provider info
        const transformed = (response.data || []).map(apt => ({
        ...apt,
        patient_name: apt.patient_first_name && apt.patient_last_name
            ? `${apt.patient_first_name} ${apt.patient_last_name}`
            : "Unknown",
        patient_contact: apt.patient_email || null,
        provider_name: apt.provider_first_name && apt.provider_last_name
            ? `${apt.provider_first_name} ${apt.provider_last_name}`
            : "Unassigned"
        }));
        console.log(transformed);
        return transformed;

    } catch (error) {
        console.error("Error fetching appointments:", error);
        return [];
  }
}