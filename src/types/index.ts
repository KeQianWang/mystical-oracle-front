export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  mood?: string;
  voiceStyle?: string;
  audioId?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface ServiceStatus {
  chat: boolean;
  tts: boolean;
  knowledge_base: boolean;
  websocket: boolean;
}

export interface HealthStatus {
  status: string;
  config_valid: boolean;
  tts_available: boolean;
  version: string;
  features: ServiceStatus;
}