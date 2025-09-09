// API 服务配置
const API_BASE_URL = "/api";

export interface ChatResponse {
  msg: string;
  id: string;
  mood: string;
  voice_style: string;
}

export interface HealthStatus {
  status: string;
  config_valid: boolean;
  tts_available: boolean;
  version: string;
  features: {
    chat: boolean;
    tts: boolean;
    knowledge_base: boolean;
    websocket: boolean;
  };
}

// 聊天 API
export const chatAPI = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    const response = await fetch(`${API_BASE_URL}/chat?query=${encodeURIComponent(message)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  },

  // 添加网页到知识库
  addUrlToKnowledge: async (url: string): Promise<{ response: string }> => {
    const response = await fetch(`${API_BASE_URL}/add_urls?URL=${encodeURIComponent(url)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to add URL to knowledge base");
    }

    return response.json();
  },

  // 获取音频文件
  getAudioUrl: (audioId: string): string => {
    return `${API_BASE_URL}/audio/${audioId}`;
  },

  // 健康检查
  getHealthStatus: async (): Promise<HealthStatus> => {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error("Health check failed");
    }

    return response.json();
  },
};

// WebSocket 连接
export const createWebSocketConnection = (): WebSocket => {
  return new WebSocket("ws://localhost:8001/ws");
};
