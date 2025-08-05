import React from "react";
import { Avatar } from "antd";
import AudioPlayer from "@/pages/components/audioPlayer/audioPlayer";
import type { Message } from "@/types";
import styles from "./messageItem.less";

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`${styles.messageItem} ${isUser ? styles.userMessage : styles.robotMessage}`}
    >
      <Avatar className={styles.avatar}>{isUser ? "我" : "预"}</Avatar>
      <div className={styles.messageContent}>
        <div className={styles.messageText}>{message.content}</div>
        <div className={styles.messageFooter}>
          <div className={styles.messageTime}>{message.time}</div>
          {!isUser && message.audioId && (
            <AudioPlayer audioId={message.audioId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
