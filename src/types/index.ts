// 消息类型定义
export interface Message {
  id: number;
  content: string;
  sender: "user" | "robot";
  time: string;
  audioId?: string; // 语音文件ID
}
