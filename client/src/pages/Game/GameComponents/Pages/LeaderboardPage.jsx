import React, {useEffect} from 'react';
import styles from '../../../../Stylesheets/Game/Components/LeaderboardPage.module.css';

function LeaderboardPage({ leaderboard, setIsQuestionPageRendering }) {
    const topFive = leaderboard.leaderboard.slice(0, 5);

    //Functions
    const getNumberWithOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    useEffect(() => {
        setIsQuestionPageRendering(false);
    }, [setIsQuestionPageRendering]);
    return (
        <div className={styles.pageContainer}>
            <div className={styles.leaderboardContainer}>
                <div className={styles.leaderboardHeader}>
                    <h1>Leaderboard</h1>
                </div>
                <div>
                    {topFive.map((item, i) => (
                        <div className={styles.leaderboardPosContainer}>
                            <h3 className={styles.leaderboardPos}><strong>{getNumberWithOrdinal(i+1)} </strong></h3> <h3
                            className={styles.leaderboardName}>{item.name} : {item.score}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LeaderboardPage;