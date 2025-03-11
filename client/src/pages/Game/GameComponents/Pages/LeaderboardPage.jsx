import React from 'react';
import styles from '../../../../Stylesheets/Game/Components/LeaderboardPage.module.css';


function LeaderboardPage({ leaderboard }) {
    const lb = leaderboard.leaderboard
    return (
        <div className={styles.pageContainer}>
            <div className={styles.leaderboardContainer}>
                <div className={styles.leaderboardHeader}>
                    <h1>Leaderboard</h1>
                </div>
                <div>
                    <div className={styles.leaderboardPosContainer}>
                        <h3 className={styles.leaderboardPos}><strong>1st </strong></h3> <h3 className={styles.leaderboardName}>{lb[0].name}</h3>
                    </div>
                    <div className={styles.leaderboardPosContainer}>
                        <h3 className={styles.leaderboardPos}><strong>2nd </strong></h3> <h3 className={styles.leaderboardName}>{lb[1].name}</h3>
                    </div>
                    <div className={styles.leaderboardPosContainer}>
                        <h3 className={styles.leaderboardPos}><strong>3rd </strong></h3> <h3 className={styles.leaderboardName}>{lb[2].name}</h3>
                    </div>
                    <div className={styles.leaderboardPosContainer}>
                        <h3 className={styles.leaderboardPos}><strong>4th </strong></h3> <h3 className={styles.leaderboardName}>{lb[3].name}</h3>
                    </div>
                    <div className={styles.leaderboardPosContainer}>
                        <h3 className={styles.leaderboardPos}><strong>5th </strong></h3> <h3 className={styles.leaderboardName}>{lb[4].name}</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeaderboardPage;