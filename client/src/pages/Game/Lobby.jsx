import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import io  from 'socket.io-client';
import styles from '../../Stylesheets/Game/Lobby.module.css';
import Join from './Join.jsx';
import Host from './Host.jsx';
import LobbyState from './LobbyState.js';

const socket = io("http://localhost:3000");

export default function Lobby() {
    //const navigate = useNavigate();

    //State is used to update subject
    const [lobbyState] = useState(new LobbyState());
    const [state, setState] = useState(lobbyState.state);

    function update(newState){
        setState(newState);
    }

    //Manage observers and react to socket updates
    useEffect(()=>{
        lobbyState.addObserver({update});

        socket.on('connect', ()=>{
            console.log('Connected to Socket.IO Server');
            lobbyState.setState({
                messages: [...state.messages, 'Connected to Socket.IO Server']
            });
        })

        socket.on('player_joined', (data)=>{
            lobbyState.setState(prevState => ({
                ...prevState,
                players: Array.isArray(prevState.players) ? [...prevState.players, { name: data.Username }] : [{ name: data.Username }],
                isHost: data.isHost
            }));
            
            updateLobbyInfo();
            console.log(`Player ${data.Username} joined lobby (Host: ${data.isHost})`);
        })        

        socket.on('host_permissions', (data)=>{
            if (data.canStartGame) {
                lobbyState.setState({
                    canStart: true
                });
            }
        })

        socket.on('game_started', (data)=>{
            lobbyState.setState(prevState => ({
                ...prevState,
                messages: Array.isArray(prevState.messages) ? [...prevState.messages, 'The game has started!'] : ['The game has started!']
            }));
            
        })

        return () => {
            socket.off('connect');
            socket.off('player_joined');
            socket.off('host_permissions');
            socket.off('game_started');
            lobbyState.removeObserver({update});
        };

    }, []);

    function updateLobbyInfo(){
        if (lobbyState.isHost)
            lobbyState.setState({
                lobbyMessage: 'You are the host. Waiting for players to join...'
            })
        else
            lobbyState.setState({
                lobbyMessage: 'Waiting for the host to start the game...'
            })
    }

    return (
        <div className={styles.lobbyPage}>
            <div className={styles.header}>
                <button className={styles.menuButton} onClick={()=>{console.log('navigate(-1)')}}>Go Back</button>
                <button className={styles.menuButton} onClick={()=>{lobbyState.setState({isHost: !state.isHost})}}>
                    {state.isHost ? 'Join' : 'Host'}
                </button>
            </div>
            <div className={styles.logo}>
                <img src="/TitleLogo.svg" alt="Uniq-Quiz Logo" />
            </div>
            <div className={styles.joinMenu}>
                {!state.isHost && (<>
                    <Join socket={socket} lobbyState={lobbyState}/>
                </>)}
                {state.isHost && (<>
                    <Host socket={socket} lobbyState={lobbyState} />
                </>)} 
            </div>
            <div className={styles.lobby}>
                {state.lobbyMessage && <p>{state.lobbyMessage}</p>}
                {state.players?.map((player, index) => <h1 key={index}>{player.name || "Unknown Player"}</h1>)}
                {state.messages?.map((msg, index) => <div key={index}>{msg}</div>)}
            </div>

            <div className={styles.browseGamesContainer}>
                <p>No Public Games</p>
            </div>      
        </div>
    )
}