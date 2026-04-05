import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

// Add a global interceptor to catch 401 (Unauthorized) errors
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            import("./LoginAuth").then(({ logout }) => {
                logout();
                window.location.href = "/";
            });
        }
        return Promise.reject(error);
    }
);

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

export async function addClassroom(req) {
    try {
        const response = await axios.post(API_URL + "/addClassRoom", req, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error adding classroom:", error);
        throw error;
    }
}

export async function getClassroom() {
    try {
        const response = await axios.get(API_URL + "/getClassRoom", getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error getting classroom:", error);
        throw error;
    }
}

export async function deleteClassroom(classroomId) {
    try {
        const response = await axios.delete(API_URL + "/deleteClassRoom", {
            data: { classroomId },
            ...getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting classroom:", error);
        throw error;
    }
}

export async function editClassroom(req) {
    try {
        const response = await axios.put(API_URL + "/editClassRoom", req, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error editing classroom:", error);
        throw error;
    }
}


export async function addTest(req) {
    try {
        const response = await axios.post(API_URL + "/addTest", req, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error adding test:", error);
        throw error;
    }
}

export async function getTests() {
    try {
        const response = await axios.get(API_URL + "/getTests", getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error getting tests:", error);
        throw error;
    }
}

export async function editTest(req) {
    try {
        const response = await axios.put(API_URL + "/editTest", req, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error editing test:", error);
        throw error;
    }
}

export async function deleteTest(testId) {
    try {
        const response = await axios.delete(API_URL + "/deleteTest", {
            data: { testId },
            ...getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting test:", error);
        throw error;
    }
}

export async function getAdminReports() {
    try {
        const response = await axios.get(API_URL + "/getAdminReports", getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error getting admin reports:", error);
        throw error;
    }
}