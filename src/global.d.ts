// types/style.d.ts 或 global.d.ts
declare module "*.less" {
  const classes: { [key: string]: string };
  export default classes;
}
