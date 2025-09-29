import { post } from "@/utils/request";
import { ApiResponse } from "@/utils/request";

const API_BASE_URL = "/api";

export const authAPI = {
  register: async (params: {
    username: string;
    password: string;
    email: string;
  }): Promise<ApiResponse> => {
    return post(`${API_BASE_URL}/auth/register`, params);
  },

  login: async (params: {
    username: string;
    password: string;
  }): Promise<ApiResponse> => {
    return post(`${API_BASE_URL}/auth/login`, params).then((res) => {
      if (res.success) {
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user || { username: params.username }),
        );
      }
      return res;
    });
  },
};
