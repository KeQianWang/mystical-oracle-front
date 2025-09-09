import React, { useEffect, useRef } from 'react';
import styles from './MessageList.less';
import { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
  onPlayAudio?: (audioId: string) => void;
  isLoading?: boolean;
}

export default function MessageList({ messages, onPlayAudio, isLoading = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMoodEmoji = (mood?: string) => {
    const moodEmojis: Record<string, string> = {
      'default': '😐',
      'friendly': '😊',
      'upbeat': '😄',
      'angry': '😠',
      'depressed': '😔',
      'cheerful': '😃'
    };
    return moodEmojis[mood || 'default'] || '😐';
  };

  const getVoiceStyleText = (voiceStyle?: string) => {
    const styleMap: Record<string, string> = {
      'calm': '平靜',
      'cheerful': '活潑',
      'angry': '憤怒',
      'sad': '悲傷',
      'friendly': '友好'
    };
    return styleMap[voiceStyle || 'calm'] || '平靜';
  };

  return (
    <div className={styles.messageListContainer}>
      <div className={styles.messageList}>
        {messages.map((message) => (
          <div key={message.id} className={`${styles.messageItem} ${styles[message.role]}`}>
            <div className={styles.messageHeader}>
              <span className={styles.messageRole}>
                {message.role === 'user' ? '您' : '陳大師'}
              </span>
              {message.mood && (
                <span className={styles.moodIndicator}>
                  {getMoodEmoji(message.mood)}
                </span>
              )}
              <span className={styles.messageTime}>
                {message.timestamp.toLocaleTimeString('zh-TW')}
              </span>
            </div>
            
            <div className={styles.messageContent}>
              {message.content}
            </div>
            
            {message.role === 'assistant' && message.audioId && onPlayAudio && (
              <div className={styles.messageActions}>
                <button 
                  onClick={() => onPlayAudio(message.audioId!)}
                  className={styles.audioButton}
                  title={`播放語音 (${getVoiceStyleText(message.voiceStyle)})`}
                >
                  🔊 播放語音
                </button>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className={`${styles.messageItem} ${styles.assistant} ${styles.loading}`}>
            <div className={styles.messageHeader}>
              <span className={styles.messageRole}>陳大師</span>
            </div>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}