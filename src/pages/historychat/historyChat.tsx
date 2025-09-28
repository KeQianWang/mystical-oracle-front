import React, { useState, useEffect } from "react";
import { Message } from "../../types";
import { chatAPI } from "../../services/chat";
import MessageList from "../../components/MessageList/MessageList";
import InputArea from "../../components/InputArea/InputArea";
import styles from "./historyChat.less";

interface HistoryChatProps {
  chatId: string;
}

export default function HistoryChat({ chatId }: HistoryChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInfo, setChatInfo] = useState<{
    title: string;
    createdAt: Date;
    updatedAt: Date;
  } | null>(null);

  useEffect(() => {
    // 模拟加载历史聊天数据
    // 实际应用中这里应该从后端API获取历史聊天记录
    const loadHistory = async () => {
      setIsLoading(true);

      // 模拟API调用延迟
      setTimeout(() => {
        const mockMessages: Message[] = [
          {
            id: "1",
            content:
              "貧道陳玉樓，人稱陳大師。精通陰陽五行，能為您算命、紫微斗數、姓名測算、占卜凶吉。請問您想算什麼？",
            role: "assistant",
            timestamp: new Date(Date.now() - 3600000),
            mood: "default",
          },
          {
            id: "2",
            content: "陳大師，我想算一下今年的運勢。",
            role: "user",
            timestamp: new Date(Date.now() - 3500000),
          },
          {
            id: "3",
            content:
              "命裡有時終須有，命裡無時莫強求。讓我為您算一下今年的運勢... 根據您的生辰八字，今年您的財運亨通，但要注意身體健康。",
            role: "assistant",
            timestamp: new Date(Date.now() - 3400000),
            mood: "friendly",
          },
        ];

        setMessages(mockMessages);
        setChatInfo({
          title: "2025年運勢查詢",
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(Date.now() - 3400000),
        });
        setIsLoading(false);
      }, 1000);
    };

    loadHistory();
  }, [chatId]);

  const handleSendMessage = async (
    content: string,
    attachments?: File[],
    url?: string,
  ) => {
    if (!content.trim() && !attachments?.length && !url?.trim()) return;

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
      const response = await chatAPI.sendMessage(content);

      const aiMessage: Message = {
        id: response.id,
        content: response.msg,
        role: "assistant",
        timestamp: new Date(),
        mood: response.mood,
        voiceStyle: response.voice_style,
        audioId: response.id,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // 更新聊天信息
      setChatInfo((prev) =>
        prev
          ? {
              ...prev,
              updatedAt: new Date(),
            }
          : null,
      );
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
    const audio = new Audio(chatAPI.getAudioUrl(audioId));
    audio.play().catch((error) => {
      console.error("Failed to play audio:", error);
    });
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.mysticalSymbol}>☯</div>
          <p>正在載入對話記錄...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.historyChatContainer}>
      {chatInfo && (
        <div className={styles.chatHeader}>
          <h2 className={styles.chatTitle}>{chatInfo.title}</h2>
          <div className={styles.chatMeta}>
            <span>創建於: {chatInfo.createdAt.toLocaleString("zh-TW")}</span>
            <span>最後更新: {chatInfo.updatedAt.toLocaleString("zh-TW")}</span>
          </div>
        </div>
      )}

      <div className={styles.chatContent}>
        <MessageList
          messages={messages}
          onPlayAudio={handlePlayAudio}
          isLoading={isLoading}
        />

        <InputArea
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          placeholder="繼續對話..."
        />
      </div>
    </div>
  );
}
