import React from "react";
import styles from "./baseLayout.less";
import { Outlet } from "umi";

export default function BaseLayout() {
  return (
    <div className={styles.fixedMenu}>
      <div className={styles.history}>left</div>
      <div className={styles.chatContainer}>
        <Outlet />
      </div>
    </div>
  );
}
