import {useCallback, useEffect, useState, useImperativeHandle} from "react";
import styles from '../../../../Stylesheets/Game/Components/Timer.module.css';

function Timer({ seconds, onTimerEnd, timerRef }) {
    const [timer, setTimer] = useState(seconds);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval = null;

        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer(prevSeconds => prevSeconds - 1);
            }, 1000);
        } else if (isActive && timer === 0) {
            setIsActive(false);
            if (onTimerEnd) onTimerEnd();
        }

        return () => clearInterval(interval);
    }, [isActive, timer]);

    const startTimer = () => setIsActive(true);
    const stopTimer = () => setIsActive(false);
    const resetTimer = () => {
        setTimer(seconds);
        setIsActive(false);
    }
    const isQuestionPageRendering = false;

    useImperativeHandle(timerRef, () => ({
            startTimer,
            stopTimer,
            resetTimer,
            isQuestionPageRendering,
        }), [startTimer, stopTimer, resetTimer, isQuestionPageRendering]);

    return(
        <div>
            <div className={styles.anim}></div>
            <div className={styles.timer}>{timer}</div>
        </div>
    )
}

export default Timer;