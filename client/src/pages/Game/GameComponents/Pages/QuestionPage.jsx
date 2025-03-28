import React from 'react';
import styles from '../../../../Stylesheets/Game/Components/QuestionPage.module.css';
import song from '../../GameAssets/Cloud Dancer.mp3';

function QuestionPage({ question, onAnswer }) {
    console.log(`QuestionPage: ${question.question}`);
    //TODO: Put this somewhere on the page for credit:
    /*
    "Cloud Dancer " Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/
     */
    return (
        <div>
            <audio src={song} autoPlay loop/>
            <div className={styles.QuestionContainer}>
                <h3 className={styles.Question}>{question.question}</h3>
            </div>

            <div>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonCyan}`} onClick={() => onAnswer(1)}>
                            <h3>{question.answers[0]}</h3></button>
                    </div>
                </div>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonYellow}`}
                                onClick={() => onAnswer(2)}><h3>{question.answers[1]}</h3></button>
                    </div>
                </div>
            </div>

            <div className={styles.QuestionButtonRow}>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonMagenta}`}
                                onClick={() => onAnswer(3)}><h3>{question.answers[2]}</h3></button>
                    </div>
                </div>
                <div className={styles.QuestionButtonCol}>
                    <div className={styles.QuestionButtonContainer}>
                        <button className={`${styles.QuestionButton} ${styles.ButtonGray}`} onClick={() => onAnswer(4)}>
                            <h3>{question.answers[3]}</h3></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionPage;