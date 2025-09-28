import { request } from "@/utils/request";

const API_BASE_URL = "/api";

export const chatAPI = {
  chat: async (query: any, session_id: any = "") => {
    return request(`${API_BASE_URL}/chat/stream`, {
      method: "POST",
      body: JSON.stringify({
        query: query,
        session_id: session_id,
        enable_tts: false,
      }),
    });
  },

  addUrlToKnowledge: async (url: string): Promise<{ response: string }> => {
    return request(
      `${API_BASE_URL}/add_knowledge?url=${encodeURIComponent(url)}`,
      {
        method: "POST",
      },
    );
  },

  getHealthStatus: async () => {
    return request(`${API_BASE_URL}/health`);
  },
};
