import React from 'react';
import styles from '../../../../Stylesheets/Game/Components/PostQuestionPage.module.css'
import Throbber from "../Components/Throbber";

function PostQuestionPage({ onAdvance }) {
    return (
        <div className={styles.pageContainer}>
            <h1>Answer Submitted</h1>
            <h2>Please wait for the others!</h2>
            <div className={styles.throbberContainer}>
                { <Throbber /> }
            </div>
        </div>
    )
}

export default PostQuestionPage;