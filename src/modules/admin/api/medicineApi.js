import axios from "axios";

export const getMedicines = async (search = "", page = 1, limit = 10) => {
  try {
    const { data } = await axios.post(
      "http://localhost/api/get_medicines.php",
      {
        search,
        page,
        limit
      }
    );

    if (data.success) return data.data;
    else throw new Error(data.message || "Failed to fetch medicines");
  } catch (err) {
    console.error("Medicines API error:", err);
    throw err;
  }
};

export const createMedicine = async (medicineData) => {
  try {
    const { data } = await axios.post(
      "http://localhost/api/create_medicine.php",
      medicineData
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to add medicine");
    }

  } catch (err) {
    console.error("Create medicine API error:", err);
    throw err;
  }
};