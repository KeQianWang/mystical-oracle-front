import React, { useState, useEffect, useRef } from "react";
import MessageList from "../../components/MessageList/MessageList";
import InputArea from "../../components/InputArea/InputArea";
import { chatAPI } from "../../services/chat";
import { Message } from "../../types";
import styles from "./chatPage.less";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "貧道陳玉樓，人稱陳大師。精通陰陽五行，能為您算命、紫微斗數、姓名測算、占卜凶吉。請問您想算什麼？",
      role: "assistant",
      timestamp: new Date(),
      mood: "default",
      voiceStyle: "calm",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState({
    tts: false,
    chat: true,
    knowledge_base: true,
    websocket: true,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 检查服务状态
  useEffect(() => {
    const checkServiceStatus = async () => {
      try {
        const health = await chatAPI.getHealthStatus();
        if (health.success) {
          setServiceStatus(health.data.features);
        }
      } catch (error) {
        console.error("Failed to check service status:", error);
      }
    };

    checkServiceStatus();
  }, []);

  const handleSendMessage = async (
    content: string,
    attachments?: File[],
    url?: string,
  ) => {
    if (!content.trim() && !attachments?.length && !url?.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content:
        content ||
        `${attachments?.map((f) => f.name).join(", ") || ""}${url ? ` URL: ${url}` : ""}`,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 处理URL添加到知识库
      if (url?.trim()) {
        try {
          await chatAPI.addUrlToKnowledge(url);
        } catch (error) {
          console.error("Failed to add URL to knowledge base:", error);
        }
      }

      // 发送聊天消息
      const response = await chatAPI.sendMessage(content);

      if (response.success && response.data) {
        // 添加AI回复
        const aiMessage: Message = {
          id: response.data.id,
          content: response.data.msg,
          role: "assistant",
          timestamp: new Date(),
          mood: response.data.mood,
          voiceStyle: response.data.voice_style,
          audioId: response.data.id,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(response.error?.message || "发送消息失败");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "抱歉，老夫現在無法為您算卦，請稍後再試。",
        role: "assistant",
        timestamp: new Date(),
        mood: "depressed",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = (audioId: string) => {
    if (audioRef.current) {
      audioRef.current.src = chatAPI.getAudioUrl(audioId);
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
  };

  return (
    <div className={`${styles.baseContainer} ${styles.mysticalTheme}`}>
      <div className={styles.chatContainer}>
        <div className={styles.serviceStatus}>
          {serviceStatus.tts && (
            <span className={styles.statusBadge}>🔊 語音</span>
          )}
          {serviceStatus.knowledge_base && (
            <span className={styles.statusBadge}>📚 知識庫</span>
          )}
          {serviceStatus.websocket && (
            <span className={styles.statusBadge}>⚡ 實時</span>
          )}
        </div>

        <MessageList
          messages={messages}
          onPlayAudio={serviceStatus.tts ? handlePlayAudio : undefined}
          isLoading={isLoading}
        />

        <InputArea
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder="請輸入您的問題..."
        />
      </div>

      {/* 隐藏的音频播放器 */}
      <audio ref={audioRef} style={{ display: "none" }} />
    </div>
  );
}
