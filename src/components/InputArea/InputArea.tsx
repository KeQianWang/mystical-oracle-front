import React, { useState, useRef, useEffect } from 'react';
import { UploadOutlined, LinkOutlined, SendOutlined, PaperClipOutlined } from '@ant-design/icons';
import styles from './InputArea.less';

interface InputAreaProps {
  onSendMessage: (message: string, attachments?: File[], url?: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function InputArea({ onSendMessage, disabled = false, placeholder = "輸入消息..." }: InputAreaProps) {
  const [message, setMessage] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0 && !url.trim()) return;
    
    onSendMessage(message, attachments, url);
    setMessage('');
    setUrl('');
    setAttachments([]);
    setShowUrlInput(false);
    
    // 发送后自动激活输入框
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'text/plain' || 
      file.type === 'text/markdown'
    );
    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className={styles.inputAreaContainer}>
      {/* 附件显示 */}
      {attachments.length > 0 && (
        <div className={styles.attachments}>
          {attachments.map((file, index) => (
            <div key={index} className={styles.attachmentItem}>
              <PaperClipOutlined />
              <span>{file.name}</span>
              <button onClick={() => removeAttachment(index)} className={styles.removeBtn}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* URL输入 */}
      {showUrlInput && (
        <div className={styles.urlInput}>
          <input
            type="url"
            placeholder="輸入網頁URL以添加到知識庫..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={styles.urlField}
          />
          <button 
            onClick={() => setShowUrlInput(false)}
            className={styles.closeBtn}
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.inputContainer}>
        <div className={styles.toolButtons}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className={styles.toolBtn}
            title="上傳文件（PDF/TXT/MD）"
            disabled={disabled}
          >
            <UploadOutlined />
          </button>
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className={styles.toolBtn}
            title="添加網頁連結到知識庫"
            disabled={disabled}
          >
            <LinkOutlined />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={styles.messageInput}
          disabled={disabled}
          rows={1}
        />

        <button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0 && !url.trim())}
          className={styles.sendBtn}
        >
          <SendOutlined />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.md"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}