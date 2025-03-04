import React from 'react';
import styles from '../../../Stylesheets/Game/Components/InfoBar.module.css'

function InfoBar(input) {
    return (
            <div className={ input.isHost ? styles.gamenavContainerHost : styles.gamenavContainer }>
                <div className={ input.isHost ? styles.gamenavInnerHost : styles.gamenavInner}>
                    <h2>{input.gameCode}</h2>
                    <h2>{input.deckName}</h2>
                    <h2>{input.displayName} : {input.score}</h2>
                </div>
                <div className={styles.buttonContainer}>
                    {input.isHost ? <button className={styles.hostButton} onClick={() => input.onAdvance(input.isHost)}><h2 className={styles.hostButtonText}>Next</h2></button> : null}
                </div>
            </div>
    )
}

export default InfoBar;