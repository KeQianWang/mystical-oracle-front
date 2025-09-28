import { request } from "@/utils/request";

const API_BASE_URL = "/api";

export const authAPI = {
  register: async (params: any) => {
    return request(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  login: async (params: any) => {
    return request(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(params),
    });
  },
};
