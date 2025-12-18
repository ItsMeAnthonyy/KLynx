import axios from "axios";

export const getICD10Categories = async () => {
    try {
        const { data } = await axios.post("http://localhost/api/get_icd10_categories.php");

        console.log("ICD10 Categories API:", data);

        if (data.success) return data.data;
        else throw new Error(data.message || "Failed to fetch ICD10 categories");

    } catch (err) {
        console.error("ICD10 Categories API error:", err);
        throw err;
    }
};

export const createICD10Category = async (name) => {
    try {
        const { data } = await axios.post(
            "http://localhost/api/create_icd10_category.php",
            { name }
        );

        console.log("Create ICD10 Category API:", data);

        if (!data.success) {
            throw new Error(data.message || "Failed to create ICD10 category");
        }

    } catch (err) {
        console.error("Create ICD10 Category API error:", err);
        throw err;
    }
};

export const updateICD10Category = async (id, name) => {
    try {
        const { data } = await axios.post(
            "http://localhost/api/update_icd10_category.php",
            {
                id: id,
                name: name
            }
        );

        console.log("Update ICD10 Category:", data);

        if (!data.success) {
            throw new Error(data.message || "Failed to update ICD10 category");
        }

    } catch (err) {
        console.error("Update ICD10 Category API error:", err);
        throw err;
    }
};

export const deleteICD10Category = async (id) => {
    try {
        const { data } = await axios.post(
            "http://localhost/api/delete_icd10_category.php",
            { id: id }
        );

        console.log("Delete ICD10 Category:", data);

        if (!data.success) {
            throw new Error(data.message || "Failed to delete ICD10 category");
        }

    } catch (err) {
        console.error("Delete ICD10 Category API error:", err);
        throw err;
    }
};




export const getICD10Codes = async (
    page = 1,
    pageSize = 10,
    searchTerm = "",
    categoryId = null
) => {
    try {
        const { data } = await axios.post("http://localhost/api/get_icd10_codes.php", {
            page,
            pageSize,
            searchTerm,
            category_id: categoryId
        });

        console.log("ICD10 Codes API:", data);

        if (data.success) {
            return {
                data: data.data,
                count: data.count,
                totalPages: data.totalPages
            };
        } else {
            throw new Error(data.message || "Failed to fetch ICD10 codes");
        }

    } catch (err) {
        console.error("ICD10 API error:", err);
        throw err;
    }
};

export const createICD10Code = async (codeData) => {
    try {
        const { data } = await axios.post(
            "http://localhost/api/create_icd10_code.php",
            codeData
        );

        console.log("Create ICD10 Code:", data);

        if (!data.success) {
            throw new Error(data.message || "Failed to create ICD10 code");
        }

    } catch (err) {
        console.error("Create ICD10 Code API error:", err);
        throw err;
    }
};

export const deleteICD10Code = async (id) => {
    try {
        const { data } = await axios.post(
            "http://localhost/api/delete_icd10_code.php",
            { id: id }
        );

        console.log("Delete ICD10 Code:", data);

        if (!data.success) {
            throw new Error(data.message || "Failed to delete ICD10 code");
        }

    } catch (err) {
        console.error("Delete ICD10 Code API error:", err);
        throw err;
    }
};


