import { useState, useEffect, useRef } from "react";
import { message } from "antd";
import { chatAPI, WebSocketService } from "@/services";
import type { Message } from "@/types";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const wsRef = useRef<WebSocketService | any>(null);
  const messageIdRef = useRef(1);

  // 初始化消息和WebSocket连接
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: messageIdRef.current++,
        content:
          "欢迎使用神秘预言师！我可以为您提供八字排盘、解梦、摇卦占卜等服务。请告诉我您想了解什么？",
        sender: "robot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];
    setMessages(initialMessages);

    // 初始化WebSocket连接
    initWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, []);

  // 初始化WebSocket
  const initWebSocket = async () => {
    try {
      wsRef.current = new WebSocketService();
      await wsRef.current.connect();

      wsRef.current.onMessage((data: any) => {
        if (data.response) {
          const robotMessage: Message = {
            id: messageIdRef.current++,
            content: data.response,
            sender: "robot",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            audioId: data.audio_id,
          };
          setMessages((prev) => [...prev, robotMessage]);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("WebSocket connection failed, falling back to HTTP API");
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim()) {
      message.warning("请输入内容");
      return;
    }

    const userMessage: Message = {
      id: messageIdRef.current++,
      content: inputValue,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = inputValue;
    setInputValue("");
    setLoading(true);

    try {
      // 优先使用WebSocket
      if (wsRef.current && wsRef.current.isConnected() && false) {
        wsRef.current.sendMessage(query);
      } else {
        // 回退到HTTP API
        const response = await chatAPI.sendMessage(query);

        const robotMessage: Message = {
          id: messageIdRef.current++,
          content: response.response,
          sender: "robot",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          audioId: response.audio_id,
        };

        setMessages((prev) => [...prev, robotMessage]);
        setLoading(false);
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      message.error("发送消息失败，请稍后重试");

      const errorMessage: Message = {
        id: messageIdRef.current++,
        content: "抱歉，我现在无法回复您的消息，请稍后重试。",
        sender: "robot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    loading,
  };
};
