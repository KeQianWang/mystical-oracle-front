// 模拟发送消息的API
export const chatAPI = {
  sendMessage: async (message: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`这是对消息的模拟回复`);
      }, 1000);
    });
  },
};
