import React, { useState } from "react";
import MessageList from "../../components/MessageList/MessageList";
import InputArea from "../../components/InputArea/InputArea";
import styles from "./chatPage.less";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '您好！我是您的AI助手，有什么可以帮助您的吗？',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string, attachments?: File[], url?: string) => {
    if (!content.trim() && !attachments?.length && !url?.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: content || `${attachments?.map(f => f.name).join(', ') || ''}${url ? ` URL: ${url}` : ''}`,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '我已收到您的消息，正在处理中...',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`${styles.baseContainer} `}>
      <div className={styles.chatContainer}>
        <MessageList messages={messages} />
        <InputArea 
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
