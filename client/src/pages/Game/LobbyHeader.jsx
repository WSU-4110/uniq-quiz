import {useNavigate} from 'react-router-dom';
import styles from '../../Stylesheets/Game/Lobby.module.css';

export default function LobbyHeader() {
    const navigate = useNavigate();

    return (
        <div className={styles.lobbyPage}>
            <div className={styles.header}>
                <button className={styles.menuButton} onClick={()=>{navigate(-1)}}>Go Back</button>
                <img src="/TitleLogo.svg" alt="Uniq-Quiz Logo" />
            </div>    
        </div>
    )
}