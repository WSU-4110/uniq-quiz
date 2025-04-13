import {useNavigate} from 'react-router-dom';
import styles from '../../Stylesheets/Game/Lobby.module.css';

export default function LobbyHeader({onClick, caption}) {
    const navigate = useNavigate();
    return (
        <div className={styles.lobbyPage}>
            <div className={styles.header}>
                <button className={styles.menuButton} onClick={()=>{navigate("/dashboard")}}>Go Back</button>
                <img src="/TitleLogo.svg" alt="Uniq-Quiz Logo" />
                <button className={styles.menuButton} onClick={onClick}>{caption ? caption : 'Null'}</button>
            </div>    
        </div>
    )
}