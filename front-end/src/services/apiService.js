import { API_URL } from "../constants/constants";

const apiService = {
  baseUrl: API_URL,

  async get(path) {
    const response = await fetch(`${this.baseUrl}/${path}`);
    return await response.json();
  },

  async post(path, data) {
    const response = await fetch(`${this.baseUrl}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  async patch(path, data) {
    const response = await fetch(`${this.baseUrl}/${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  async delete(path) {
    const response = await fetch(`${this.baseUrl}/${path}`, {
      method: "DELETE",
    });
    return await response.json();
  },
};

export default apiService;
