export const routes = [
  {
    path: "/",
    redirect: "/chat",
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
