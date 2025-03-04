import React from 'react';
import styles from "../../../Stylesheets/Game/Components/StartPage.module.css";
import Throbber from "./Throbber";


function StartPage({ onAdvance }) {

    return (
        <div className={styles.pageContainer}>
            <h1>Get Ready To Start!</h1>
            <h2>We will start soon</h2>
            {<Throbber/>}
        </div>
    )
}

export default StartPage;