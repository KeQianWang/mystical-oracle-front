import { post, get } from "@/utils/request";
import { ApiResponse } from "@/utils/request";

const API_BASE_URL = "/api";

export const chatAPI = {
  chat: async (
    query: string,
    session_id: string = "",
  ): Promise<ApiResponse> => {
    return post(`${API_BASE_URL}/chat/stream`, {
      query,
      session_id,
      enable_tts: false,
    });
  },

  getHealthStatus: async (): Promise<ApiResponse> => {
    return get(`${API_BASE_URL}/health`);
  },
};
