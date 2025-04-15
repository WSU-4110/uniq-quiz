import React, {useEffect} from 'react';
import styles from '../../../../Stylesheets/Game/Components/QuestionPage.module.css';
import song from '../../GameAssets/Cloud Dancer.mp3';

function QuestionPage({ question, onAnswer, setIsQuestionPageRendering}) {
    console.log(`QuestionPage: ${question.question}`);
    console.log(`CorrectAnswer: ${question.correctAnswerID}`)
    useEffect(() => {
        setIsQuestionPageRendering(true);
    }, [setIsQuestionPageRendering]);
    //TODO: Put this somewhere on the page for credit:
    /*
    "Cloud Dancer " Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/
     */
    //idToLoc is the answer ID, the stored number is the ID not the index
    return (
        <div className={styles.PageContainer}>
            <audio src={song} autoPlay loop/>
            <div className={styles.QuestionContainer}>
                <h3 className={styles.Question}>{question.question}</h3>
            </div>

            <div className={styles.AnswerGridContainer}>
                <div className={styles.AnswerGrid}>
                    <div className={`${styles.AnswerContainer} ${styles.ButtonCyan}`}>
                        <button className={styles.AnswerButton} onClick={() => onAnswer(question.idToLoc[0])}>
                            <h3>{question.answers[0]}</h3>
                        </button>
                    </div>

                    <div className={`${styles.AnswerContainer} ${styles.ButtonYellow}`}>
                        <button className={styles.AnswerButton} onClick={() => onAnswer(question.idToLoc[1])}>
                            <h3>{question.answers[1]}</h3>
                        </button>
                    </div>

                    <div className={`${styles.AnswerContainer} ${styles.ButtonMagenta}`}>
                        <button className={styles.AnswerButton} onClick={() => onAnswer(question.idToLoc[2])}>
                            <h3>{question.answers[2]}</h3>
                        </button>
                    </div>

                    <div className={`${styles.AnswerContainer} ${styles.ButtonTeal}`}>
                        <button className={styles.AnswerButton} onClick={() => onAnswer(question.idToLoc[3])}>
                            <h3>{question.answers[3]}</h3>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionPage;