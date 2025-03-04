import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from '../../Stylesheets/Game/Lobby.module.css';
import {useSocket} from '../../context/SocketContext.jsx';

export default function Lobby({children}) {
    const navigate = useNavigate();

    return (
        <div className={styles.lobbyPage}>
            <div className={styles.header}>
                <button className={styles.menuButton} onClick={()=>{navigate(-1)}}>Go Back</button>
            </div>
            <div className={styles.logo}>
                <img src="/TitleLogo.svg" alt="Uniq-Quiz Logo" />
            </div>
            <div className={styles.joinMenu}>
                {children}
            </div>
            <div className={styles.browseGamesContainer}>
                <p>No Public Games</p>
            </div>      
        </div>
    )
}