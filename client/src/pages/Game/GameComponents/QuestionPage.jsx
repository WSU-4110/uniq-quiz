import React from 'react';
import styles from '../../../Stylesheets/Game/Components/QuestionPage.module.css';

function QuestionPage({ onAdvance }) {
    return (
        <div>
            <div className={styles.QuestionContainer}>
                <h3 className={styles.Question}>What is the output to the python function "print(0.1 + 0.2)"?</h3>
            </div>

            <div>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonCyan}`}><h3>0.3</h3></button>
                    </div>
                </div>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonYellow}`}><h3>3</h3></button>
                    </div>
                </div>
            </div>

            <div className={styles.QuestionButtonRow}>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonMagenta}`}><h3>3.3</h3></button>
                    </div>
                </div>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonGray}`}><h3>0.30000000000000004</h3></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionPage;