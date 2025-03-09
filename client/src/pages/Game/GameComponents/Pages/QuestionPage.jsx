import React from 'react';
import styles from '../../../../Stylesheets/Game/Components/QuestionPage.module.css';
import {Question} from "../../GameLogic";

function QuestionPage({ Question: Question, onAnswer }) {
    return (
        <div>
            <div className={styles.QuestionContainer}>
                <h3 className={styles.Question}>{Question.question}</h3>
            </div>

            <div>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonCyan}`} onClick={() => onAnswer(1)}><h3>{Question.answers[0]}</h3></button>
                    </div>
                </div>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonYellow}`} onClick={() => onAnswer(2)}><h3>{Question.answers[1]}</h3></button>
                    </div>
                </div>
            </div>

            <div className={styles.QuestionButtonRow}>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonMagenta}`} onClick={() => onAnswer(3)}><h3>{Question.answers[2]}</h3></button>
                    </div>
                </div>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonGray}`} onClick={() => onAnswer(4)}><h3>{Question.answers[3]}</h3></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionPage;