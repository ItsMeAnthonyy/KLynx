import axios from "axios";
const BASE_URL = "http://localhost/api/icd10";
const CATEGORY_URL = "http://localhost/api/icd10_categories";

/*
TO CLEAN
*/

export const getICD10Categories = async ({
    search = "",
    page = 1,
    limit = 10,
}) => {
    try {
        const response = await axios.get(`${CATEGORY_URL}/get_all_2.php`, {
            params: { 
                search,
                page,
                limit 
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch icd10 categories record";

        throw new Error(message);
    }
};

export const getICD10CategoryOptions = async () => {
    try {
        const response = await axios.get(
            `${CATEGORY_URL}/get_all.php`, 
            {
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch ICD10 category options";

        throw new Error(message);
    }
};

export const createICD10Category = async (icd10CategoryData) => {
    try {
        const response = await axios.post(
            `${CATEGORY_URL}/create.php`,
            icd10CategoryData,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to create icd10 category entry";

        throw new Error(message);
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


export const getICD10 = async ({
    searchTerm = "",
    page = 1,
    pageSize = 10,
    categoryId = null
}) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/get_by_id.php`, 
            {
                params: { 
                    searchTerm,
                    page,
                    pageSize,
                    category_id: categoryId
                },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch ICD10 record";

        throw new Error(message);
    }
};


export const getICD10Codes = async (
    searchTerm = "",
    page = 1,
    pageSize = 10,
    categoryId = null
) => {
    try {
        const { data } = await axios.post("http://localhost/api/get_icd10_codes.php", {
            page,
            pageSize,
            searchTerm,
            category_id: categoryId //not used yet, for search filtering
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

export const createICD10 = async (icd10Data) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/create.php`,
            icd10Data,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "Failed to create icd10 entry";

        throw new Error(message);
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


