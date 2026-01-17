import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const login = async (name, type, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      name,
      type,
      password,
    });

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("type", type);
    return { success: true, data: response.data };

  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.error || "Login failed",
        status: error.response.status,
      };
    } else {
      return {
        success: false,
        message: "Server not reachable",
      };
    }
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};
