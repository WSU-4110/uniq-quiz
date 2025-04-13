import React, { useEffect, useState } from 'react';
import styles from "../../../../Stylesheets/Game/Components/StartPage.module.css";
import Throbber from "../Components/Throbber";

function StartPage({ everyoneConnected, start }) {
    const [countdown, setCountdown] = useState(null);
    const [showStart, setShowStart] = useState(false);

    useEffect(() => {
        if (everyoneConnected) {
            setCountdown(3);
        }
    }, [everyoneConnected]);

    useEffect(() => {
        if (countdown === null) return;

        if (countdown > 0) {
            const timerId = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timerId);
        } else if (countdown === 0) {
            setShowStart(true);
            const timerId = setTimeout(() => {
                start();
            }, 1000);
            return () => clearTimeout(timerId);
        }
    }, [countdown, start]);

    return (
        <div className={styles.pageContainer}>
            <h1>Get Ready To Start!</h1>
            <h2>
                {showStart
                    ? "Start!"
                    : (countdown !== null ? countdown : "We will start soon")
                }
            </h2>
            <Throbber />
        </div>
    );
}

export default StartPage;
