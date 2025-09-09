import { defineConfig } from "umi";
import { routes } from "./src/routes/index";

const proxy = {
  dev: {
    "/api": {
      target: "http://localhost:8001",
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    },
  },
};

export default defineConfig({
  //source-map 文件可以帮助开发者在浏览器调试工具中看到原始的源代码，而不是打包后的代码，从而方便调试
  devtool: "source-map",
  routes: routes,
  npmClient: "yarn",
  proxy: proxy["dev"],
  //这个配置启用了使用 esbuild 对代码进行压缩，且输出为立即调用函数表达式（IIFE）的格式。该选项有助于优化构建输出，减小 JavaScript 文件的体积。
  esbuildMinifyIIFE: true,
  //这个配置启用了构建输出文件名的哈希值。它会根据文件内容生成一个哈希值并附加到文件名后面，这对于缓存破坏非常有用。在生产环境中，这样可以确保更新后的文件有新的文件名，避免浏览器缓存旧版本的文件。
  hash: true,
  // 结合publicPath，history，在build成功后，点击index.html也可以查看项目
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  // 这个配置指定了 Umi 使用的路由历史类型。设置为 type: "hash" 表示使用 URL 中的哈希值（#）来管理导航。这种方式通常用于静态文件服务器等不支持服务器端路由的环境中。
  history: {
    type: "hash",
  },
});
