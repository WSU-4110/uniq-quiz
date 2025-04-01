import React from 'react';
import styles from '../../../../Stylesheets/Game/Components/PostGamePage.module.css';

function PostGamePage({ leaderboard }) {
    const lb = leaderboard.leaderboard;
    const dynamicHeight = Math.min(lb.length * 30, 160);

    const getNumberWithOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    return (
        <div>
            <div className={styles.pageContainer}>
                <div className={styles.podiumContainer}>
                    <div className={styles.podiumSecond}>
                        <h4 className={styles.podiumName}>{ lb[1]?.name }</h4>
                        <h2>2nd</h2>
                    </div>
                    <div className={styles.podiumFirst}>
                        <h4 className={styles.podiumName}>{ lb[0]?.name }</h4>
                        <h1>1st</h1>
                    </div>
                    <div className={styles.podiumThird}>
                        <h4 className={styles.podiumName}>{ lb[2]?.name }</h4>
                        <h3>3rd</h3>
                    </div>
                </div>

                <div className={styles.scrollContainer}
                     style={{ '--scroll-max-height': `${dynamicHeight}vh` }}>
                    <div className={styles.leaderboardContainer}>
                        <div className={styles.leaderboardHeader}>
                            <h1> Final Leaderboard</h1>
                        </div>
                        <div>
                            {lb.map((item, i) => (
                                <div className={styles.leaderboardPosContainer}>
                                    <h3 className={styles.leaderboardPos}><strong>{getNumberWithOrdinal(i+1)} </strong></h3> <h3
                                    className={styles.leaderboardName}>{item.name} : {item.score}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default PostGamePage;