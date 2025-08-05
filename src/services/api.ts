// API 服务配置
const API_BASE_URL = 'http://localhost:8000';

// 请求配置
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// 通用请求方法
async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}



export interface ChatResponse {
  response: string;
  audio_id?: string;
}

export const chatAPI = {
  // 发送聊天消息
  sendMessage: (data: string): Promise<ChatResponse> =>
    request<ChatResponse>('/chat', {
      method: 'POST',
      body: data
    }),

  // 获取语音文件
  getAudio: (audioId: string): string =>
    `${API_BASE_URL}/audio/${audioId}`,
};

// 健康检查接口
export const healthAPI = {
  check: (): Promise<{ status: string }> =>
    request<{ status: string }>('/health'),
};

// 知识库接口
export interface AddUrlsRequest {
  urls: string[];
}

export const knowledgeAPI = {
  addUrls: (data: AddUrlsRequest): Promise<{ message: string }> =>
    request<{ message: string }>('/add_urls', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};