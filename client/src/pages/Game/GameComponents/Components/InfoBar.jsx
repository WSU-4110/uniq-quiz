import React from 'react';
import styles from '../../../../Stylesheets/Game/Components/InfoBar.module.css'

//Components
import Timer from './Timer';

function InfoBar({isHost, deckName, displayName, onAdvance, score, onTimerEnd, timerRef, endGameText, onEndGame}) {
    return (
            <div className={ isHost ? styles.gamenavContainerHost : styles.gamenavContainer }>
                <div className={ isHost ? styles.gamenavInnerHost : styles.gamenavInner}>
                    <h2><Timer seconds={5} onTimerEnd={onTimerEnd} timerRef={timerRef}/></h2>
                    <h2>{deckName}</h2>
                    <h2>{displayName} : {score}</h2>
                </div>
                <div className={styles.buttonContainer}>
                    {isHost ? <button className={styles.hostButton} onClick={onEndGame}><h2>{endGameText}</h2></button> : null}
                    {isHost ? <button className={styles.hostButton} onClick={() => onAdvance(isHost)}><h2 className={styles.hostButtonText}>Next</h2></button> : null}
                </div>
            </div>
    )
}

export default InfoBar;