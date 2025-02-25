import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import io  from 'socket.io-client';
import styles from '../../Stylesheets/Game/Lobby.module.css';
import Join from './Join.jsx';
import Host from './Host.jsx';

const socket = io("http://localhost:3000");

export default function Lobby() {
    const navigate = useNavigate();
    
    //Subject Class: stored in useStates for best React practice
    const [joinCode, setJoinCode] = useState("");
    const [isHost, setIsHost] = useState(false);
    const [canStart, setCanStart] = useState(false);
    const [lobbyMessage, setLobbyMessage] = useState(null);
    const [messages, setMessages] = useState([]); 
    const [players, setPlayers] = useState([]);

    //Observers: stored in useEffect hook
    useEffect(()=>{
        socket.on('connect', ()=>{
            console.log('Connected to Socket.IO Server');
            setMessages((prevMessages) => [
                ...prevMessages,
                'Connected to Socket.IO Server'
            ]);
        })

        socket.on('player_joined', (data)=>{
            setPlayers((prevPlayers) => [
                ...prevPlayers,
                { name: data.Username }
            ]); 
            setIsHost(data.isHost);
            updateLobbyInfo();
            console.log(`Player ${data.Username} joined lobby (Host: ${data.isHost})`);
        })        

        socket.on('host_permissions', (data)=>{
            if (data.canStartGame) {
                setCanStart(true);
            }
        })

        socket.on('game_started', (data)=>{
            setMessages((prevMessages) => [
                ...prevMessages,
                'The game has started!'
            ]);
            console.log('Game has started!');
        })

        return () => {
            socket.off('connect');
            socket.off('player_joined');
            socket.off('host_permissions');
            socket.off('game_started');
        };

    }, []);

    //Controller function for Lobby
    function updateLobbyInfo(){
        setLobbyMessage( isHost ? 'You are the host. Waiting for players to join...' : 'Waiting for the host to start the game...');
    }

    return (
        <div className={styles.lobbyPage}>
            <div className={styles.header}>
                <button className={styles.menuButton} onClick={()=>{navigate(-1)}}>Go Back</button>
                <button className={styles.menuButton} onClick={()=>{setIsHost(!isHost)}}>
                    {isHost ? 'Join' : 'Host'}
                </button>
            </div>
            <div className={styles.logo}>
                <img src="/TitleLogo.svg" alt="Uniq-Quiz Logo" />
            </div>
            <div className={styles.joinMenu}>
                {!isHost && (<>
                    <Join socket={socket} joinCode={joinCode} setJoinCode={setJoinCode}/>
                </>)}
                {isHost && (<>
                    <Host socket={socket} joinCode={joinCode} setJoinCode={setJoinCode} setLobbyMessage={setLobbyMessage} />
                </>)} 
                {lobbyMessage && <p>{lobbyMessage}</p>}
            </div>
            <div className={styles.lobby}>
                <p>{lobbyMessage}</p>
                {players.map((player, index) => (
                    <h1 key={index}>{player.name ? player.name : "Unknown Player"}</h1>
                ))}
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))} 
            </div>

            <div className={styles.browseGamesContainer}>
                <p>No Public Games</p>
            </div>      
        </div>
    )
} 