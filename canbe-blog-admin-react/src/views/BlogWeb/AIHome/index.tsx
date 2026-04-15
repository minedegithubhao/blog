import React from "react";
import { AI_COMPANIONS } from "../constants";
import styles from "./index.module.scss";

const AIHome: React.FC = () => {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>AI Companion Lab</span>
          <h1>把 AI 能力先收敛成一个清晰入口</h1>
          <p>
            当前版本只保留 AI 专栏第一屏，先把三位角色卡片稳定落地。
            后续的按钮、对话页、更多分区下一版再继续扩。
          </p>
        </div>
        <div className={styles.heroAside}>
          <span className={styles.asideTitle}>Version 1</span>
          <p>先做入口层，先把信息架构拉直，再叠交互和业务能力。</p>
        </div>
      </div>

      <div className={styles.cardGrid}>
        {AI_COMPANIONS.map((companion) => (
          <article
            key={companion.id}
            className={styles.card}
            data-theme={companion.theme}
          >
            <div className={styles.imageWrap}>
              <img src={companion.image} alt={companion.name} className={styles.avatar} />
            </div>
            <div className={styles.badgeRow}>
              <span className={styles.role}>{companion.role}</span>
              <span className={styles.accent}>{companion.accent}</span>
            </div>
            <h2>{companion.name}</h2>
            <p>{companion.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AIHome;

