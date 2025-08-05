import React, { useEffect, useRef } from "react";
import type { Message } from "@/types";
import styles from "./messageList.less";
import MessageItem from "@/pages/components/messageList/messageItem/messageItem";
import LoadingMessage from "@/pages/components/loadingMessage/loadingMessage";

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className={styles.messageList}>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {loading && <LoadingMessage />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
