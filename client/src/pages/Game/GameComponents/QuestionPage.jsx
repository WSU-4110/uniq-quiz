import React from 'react';
import styles from '../../../Stylesheets/Game/Components/QuestionPage.module.css';

function QuestionPage({ Question, Answer1, Answer2, Answer3, Answer4 }) {
    return (
        <div>
            <div className={styles.QuestionContainer}>
                <h3 className={styles.Question}>{Question}</h3>
            </div>

            <div>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonCyan}`}><h3>{Answer1}</h3></button>
                    </div>
                </div>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonYellow}`}><h3>{Answer2}</h3></button>
                    </div>
                </div>
            </div>

            <div className={styles.QuestionButtonRow}>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonMagenta}`}><h3>{Answer3}</h3></button>
                    </div>
                </div>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonGray}`}><h3>{Answer4}</h3></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionPage;