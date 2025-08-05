import React, { useState, useRef } from "react";
import { Button } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { chatAPI } from "@/services";
import styles from "./audioPlayer.less";

interface AudioPlayerProps {
  audioId: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = async () => {
    if (!audioRef.current) {
      setLoading(true);
      try {
        const audioUrl = chatAPI.getAudio(audioId);
        audioRef.current = new Audio(audioUrl);

        audioRef.current.onended = () => {
          setIsPlaying(false);
        };

        audioRef.current.onerror = () => {
          console.error("音频播放失败");
          setIsPlaying(false);
          setLoading(false);
        };

        audioRef.current.oncanplay = () => {
          setLoading(false);
        };
      } catch (error) {
        console.error("获取音频失败:", error);
        setLoading(false);
        return;
      }
    }

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current?.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("播放音频失败:", error);
      }
    }
  };

  return (
    <Button
      type="text"
      size="small"
      className={styles.audioButton}
      icon={
        loading ? (
          <LoadingOutlined />
        ) : isPlaying ? (
          <PauseCircleOutlined />
        ) : (
          <PlayCircleOutlined />
        )
      }
      onClick={handlePlay}
      disabled={loading}
    >
      {loading ? "加载中" : isPlaying ? "暂停" : "播放"}
    </Button>
  );
};

export default AudioPlayer;
