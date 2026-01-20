import React, { useEffect, useState, useCallback } from "react";
import usePlayer from "../../stores/usePlayer";
import styles from "./ProgressBar.module.scss";

const selectXp = (state) => state.xp;
const selectLevel = (state) => state.level;

export default function ProgressBar() {
  const xp = usePlayer(selectXp);
  const level = usePlayer(selectLevel);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const xpForNextLevel = level * 100;
    const currentProgress = Math.min((xp / xpForNextLevel) * 100, 100);
    setProgress(Math.floor(currentProgress));
    console.log(`XP: ${xp}, Level: ${level}, Progress: ${currentProgress}%`);
  }, [xp, level]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.statsContainer}>
        <p className={styles.statText}>Lvl: {level}</p>
        {/* <p className={styles.statText}>Xp: {progress}%</p> */}
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.fill}
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
