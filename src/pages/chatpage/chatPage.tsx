import React from "react";
import { useChat } from "@/hooks";
import styles from "./chatPage.less";
import MessageList from "@/pages/components/messageList/messageList";
import InputArea from "@/pages/components/InputArea/inputArea";

export default function ChatPage() {
  const { messages, sendMessage, loading, inputValue, setInputValue } =
    useChat();

  // 按键回车发送消息
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  return (
    <div className={`${styles.baseContainer} `}>
      <div className={styles.chatContainer}>
        <MessageList messages={messages} loading={loading} />
        <InputArea
          value={inputValue}
          onChange={setInputValue}
          onSend={sendMessage}
          onKeyPress={handleKeyPress}
          loading={loading}
        />
      </div>
    </div>
  );
}
