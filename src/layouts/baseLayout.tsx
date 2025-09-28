import React, { useState } from "react";
import styles from "./baseLayout.less";
import { Outlet, useNavigate, useLocation } from "umi";
import {
  HomeOutlined,
  HistoryOutlined,
  UserOutlined,
  ThunderboltOutlined,
  MoonOutlined,
  HeartOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Button, message } from "antd";

interface ChatSession {
  id: string;
  title: string;
  date: string;
  preview: string;
}

export default function BaseLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // 检查用户登录状态
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isLoggedIn = !!token && !!user;
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: '2025年運勢查詢',
      date: '2025-01-09',
      preview: '根據您的生辰八字，今年您的財運亨通...'
    },
    {
      id: '2',
      title: '解夢：夢見蛇',
      date: '2025-01-08',
      preview: '夢見蛇通常預示著好運即將來臨...'
    },
    {
      id: '3',
      title: '八字排盤',
      date: '2025-01-07',
      preview: '您的八字顯示，五行缺金，建議...'
    }
  ]);

  const quickActions = [
    { icon: <ThunderboltOutlined />, label: '八字算命', action: 'bazi' },
    { icon: <MoonOutlined />, label: '解夢', action: 'dream' },
    { icon: <HeartOutlined />, label: '搖卦占卜', action: 'divination' }
  ];

  const handleQuickAction = (action: string) => {
    // 如果用户未登录，跳转到登录页面
    if (!isLoggedIn) {
      message.warning("请先登录后再使用功能");
      navigate("/login");
      return;
    }

    const prompts = {
      bazi: '我想做八字排盤，請問需要提供什麼信息？',
      dream: '我做了個夢，能幫我解釋一下嗎？',
      divination: '請為我搖一卦，看看最近的運勢如何？'
    };

    if (location.pathname === '/chat') {
      // 如果在新聊天页面，直接填充输入框
      const inputElement = document.querySelector('textarea') as HTMLTextAreaElement;
      if (inputElement) {
        inputElement.value = prompts[action as keyof typeof prompts];
        inputElement.focus();
      }
    } else {
      // 否则跳转到新聊天页面
      navigate('/chat');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    message.success("已成功退出登录");
    navigate("/login");
  };

  return (
    <div className={styles.fixedMenu}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.mysticalIcon}>🔮</span>
            <h1>神秘預言師</h1>
          </div>
          <p className={styles.subtitle}>陳大師在線算命</p>
        </div>

        <div className={styles.quickActions}>
          <h3>快速功能</h3>
          <div className={styles.actionButtons}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={styles.actionButton}
                onClick={() => handleQuickAction(action.action)}
                title={action.label}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.chatHistory}>
          <div className={styles.historyHeader}>
            <h3>對話歷史</h3>
            <button
              className={styles.newChatBtn}
              onClick={() => {
                if (!isLoggedIn) {
                  message.warning("请先登录后再创建新对话");
                  navigate("/login");
                  return;
                }
                navigate('/chat');
              }}
            >
              <HomeOutlined /> 新對話
            </button>
          </div>

          <div className={styles.sessionList}>
            {sessions.map((session) => (
              <div
                key={session.id}
                className={styles.sessionItem}
                onClick={() => {
                  if (!isLoggedIn) {
                    message.warning("请先登录后再查看历史对话");
                    navigate("/login");
                    return;
                  }
                  navigate(`/chat/${session.id}`);
                }}
              >
                <div className={styles.sessionHeader}>
                  <h4 className={styles.sessionTitle}>{session.title}</h4>
                  <span className={styles.sessionDate}>{session.date}</span>
                </div>
                <p className={styles.sessionPreview}>{session.preview}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <UserOutlined />
            {isLoggedIn ? (
              <>
                <span>{user.username || '已登录用户'}</span>
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  className={styles.logoutBtn}
                  title="退出登录"
                >
                  退出
                </Button>
              </>
            ) : (
              <>
                <span>訪客用戶</span>
                <Button
                  type="link"
                  onClick={() => navigate("/login")}
                  className={styles.loginBtn}
                >
                  登录
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.chatContainer}>
        <Outlet />
      </div>
    </div>
  );
}
