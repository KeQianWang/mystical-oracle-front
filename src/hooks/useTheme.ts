import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('light');

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  // 初始化主题
  useEffect(() => {
    document.body.className = theme;
  }, []);

  return {
    theme,
    toggleTheme,
  };
};