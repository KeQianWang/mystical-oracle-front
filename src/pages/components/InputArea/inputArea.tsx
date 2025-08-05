import React from "react";
import { Button, Input } from "antd";
import { SendOutlined, LoadingOutlined } from "@ant-design/icons";
import styles from "./inputArea.less";

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  loading?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  loading = false,
}) => {
  return (
    <div className={styles.inputArea}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="请输入您的问题..."
        className={styles.input}
        disabled={loading}
      />
      <Button
        type="primary"
        icon={loading ? <LoadingOutlined /> : <SendOutlined />}
        onClick={onSend}
        className={styles.sendButton}
        loading={loading}
        disabled={loading || !value.trim()}
      >
        {loading ? "发送中" : "发送"}
      </Button>
    </div>
  );
};

export default InputArea;
