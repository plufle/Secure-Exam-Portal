import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const login = async (username, type, password) => {
  try {
    const payload = type === "student" ? { email: username, type, password } : { name: username, type, password };
    const response = await axios.post(`${API_URL}/login`, payload);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("type", type);
    localStorage.setItem("name", username);
    if (response.data.lastLogin) {
      localStorage.setItem("lastLogin", response.data.lastLogin);
    }
    return { success: true, data: response.data };

  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.error || "Login failed",
        status: error.response.status,
        needsPasswordChange: error.response.data.needsPasswordChange,
        email: error.response.data.email
      };
    } else {
      return {
        success: false,
        message: "Server not reachable",
      };
    }
  }
};

export const studentChangePassword = async (email, oldPassword, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/student-change-password`, {
      email,
      oldPassword,
      newPassword,
    });
    
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("type", "student");
    localStorage.setItem("name", email);

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.error || "Failed to change password",
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
  localStorage.removeItem("type");
  localStorage.removeItem("name");
};
