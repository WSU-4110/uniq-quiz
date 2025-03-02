import React from 'react';
import styles from '../../../Stylesheets/Game/Components/PostGamePage.module.css';

function PostGamePage({ first, second, third, others }) {
    return (
        <div>
            <div className={styles.pageContainer}>
                <div className={styles.podiumContainer}>
                    <div className={styles.podiumSecond}>
                        <h4>Name</h4>
                        <h2>2nd</h2>
                    </div>
                    <div className={styles.podiumFirst}>
                        <h4>Name</h4>
                        <h1>1st</h1>
                    </div>
                    <div className={styles.podiumThird}>
                        <h4 className={styles.podiumName}>Name</h4>
                        <h3>3rd</h3>
                    </div>
                </div>

                <div className={styles.leaderboardContainer}>
                    <div className={styles.leaderboardHeader}>
                        <h1>Leaderboard</h1>
                    </div>
                    <div>
                        <div className={styles.leaderboardPosContainer}>
                            <h3 className={styles.leaderboardPos}><strong>1st </strong></h3>
                            <h3 className={styles.leaderboardName}>{others}</h3>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default PostGamePage;