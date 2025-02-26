import {useState} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import styles from '../../Stylesheets/Game/Join.module.css'

export default function Host({socket, lobbyState}){
    const [canStart, setCanStart] = useState(false);
    const {user, userName} = useAuth();

    //Controller functions
    function createGame(){
        const newJoinCode = Math.random().toString(36).substring(2, 9);
        lobbyState.setState({joinCode: newJoinCode, lobbyMessage: `Game created! Join code: ${newJoinCode}`});
        console.log(user);
        socket.emit('join_lobby', { Join_Code: newJoinCode, User_id: user, Username: userName });
        
        socket.on("host_permissions", (data) => {
            if (data.canStartGame) setCanStart(true);
        });
    }

    function startGame(){
        socket.emit('start_game', { Join_Code: lobbyState.state.joinCode });
        setCanStart(false);
    }


    return(
        <>
            <button className={styles.menuButton} onClick={createGame}>Create Game</button>
            {canStart && <button className={styles.menuButton} onClick={startGame}>Start Game</button>}
        </>

    );
}