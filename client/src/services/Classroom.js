import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

export async function addClassroom(req) {
    try {
        const response = await axios.post(API_URL + "/addClassRoom", req);
        return response.data;
    } catch (error) {
        console.error("Error adding classroom:", error);
        throw error;
    }
}

export async function getClassroom() {
    try {
        const response = await axios.get(API_URL + "/getClassRoom");
        return response.data;
    } catch (error) {
        console.error("Error getting classroom:", error);
        throw error;
    }
}

export async function deleteClassroom(classroomId) {
    try {
        const response = await axios.delete(API_URL + "/deleteClassRoom", {
            data: { classroomId }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting classroom:", error);
        throw error;
    }
}

export async function editClassroom(req) {
    try {
        const response = await axios.put(API_URL + "/editClassRoom", req);
        return response.data;
    } catch (error) {
        console.error("Error editing classroom:", error);
        throw error;
    }
}
