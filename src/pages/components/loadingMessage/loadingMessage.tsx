import React from "react";
import { Avatar } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./loadingMessage.less";

const LoadingMessage: React.FC = () => {
  return (
    <div className={`${styles.messageItem} ${styles.robotMessage}`}>
      <Avatar className={styles.avatar}>预</Avatar>
      <div className={styles.messageContent}>
        <div className={styles.loadingText}>
          <LoadingOutlined className={styles.loadingIcon} />
          正在思考中...
        </div>
      </div>
    </div>
  );
};

export default LoadingMessage;
