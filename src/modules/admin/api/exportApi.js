import axios from "axios";

const BASE_URL = "http://localhost/api/patients";

export async function exportFile({
    endpoint,
    filename,
    params = {},
}) {
    try {
        console.log(params);
        const response = await axios.get(
            `${BASE_URL}/${endpoint}`,
            {
                params,
                responseType: "blob",
                withCredentials: true,
            }
        );

        console.log("Here?");

        const blob = new Blob([response.data], {
            type: response.headers["content-type"],
        });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Export failed:", error);
        throw error;
    }
}