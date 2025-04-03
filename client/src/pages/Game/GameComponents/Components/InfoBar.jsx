import React, {useState} from 'react';
import styles from '../../../../Stylesheets/Game/Components/InfoBar.module.css'

//Components
import Timer from './Timer';

function InfoBar({gameCode, isHost, deckName, displayName, onAdvance, score, onTimerEnd, timerRef, numPlayerAnswers, onEndGame, endGameText, isQuestionPageRendering, seconds}) {
    return (
            <div className={ isHost ? styles.gamenavContainerHost : styles.gamenavContainer }>
                <div className={ isHost ? styles.gamenavInnerHost : styles.gamenavInner}>
                    <h2>
                        {isQuestionPageRendering ? (
                        <Timer seconds={seconds} onTimerEnd={onTimerEnd} timerRef={timerRef}/>
                        ) : (
                            gameCode
                        )}
                        </h2>
                    <h2>{deckName}</h2>
                    <h2>{displayName} : {score}</h2>
                </div>
                <div className={styles.buttonContainer}>
                    {numPlayerAnswers && <h2>Players Answered: {numPlayerAnswers}</h2>}
                    {isHost ? <button className={styles.hostButton} onClick={onEndGame}><h2>{endGameText}</h2></button> : null}
                    {!isHost ? <button className={styles.hostButton} onClick={onEndGame}><h2>Exit Game</h2></button> : null}
                    {isHost ? <button className={styles.hostButton} onClick={() => onAdvance(isHost)}><h2 className={styles.hostButtonText}>Next</h2></button> : null}
                </div>
            </div>
    )
}

export default InfoBar;