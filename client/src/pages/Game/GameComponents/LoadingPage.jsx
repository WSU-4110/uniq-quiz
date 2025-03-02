import React from 'react';
import styles from '../../../Stylesheets/Game/Components/LoadingPage.module.css';
import Throbber from "./Throbber";

function LoadingPage({ onAdvance }) {
    return (
        <div className={styles.pageContainer}>
            <h1>Loading</h1>
            <h2>Please wait</h2>
            {<Throbber/>}
        </div>
    )
}

export default LoadingPage;