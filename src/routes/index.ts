export const routes = [
  {
    path: "/",
    redirect: "/chat",
  },
  {
    name: "登录页面",
    path: "/login",
    component: "@/pages/login/login",
    layout: false, // 登录页面不使用布局
  },
  {
    path: "/",
    name: "布局展示",
    component: "@/layouts/baseLayout",
    routes: [
      {
        name: "新聊天界面",
        path: "/chat",
        component: "@/pages/chatpage/chatPage",
      },
      {
        name: "历史聊天",
        path: "/chat/:id",
        component: "@/pages/historychat/historyChat",
      },
    ],
  },
];
