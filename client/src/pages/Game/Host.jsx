import {useState, useEffect} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import {Link, Navigate} from 'react-router';
import Lobby from './Lobby.jsx';
import {useSocket} from '../../context/SocketContext.jsx';
import styles from '../../Stylesheets/Game/Join.module.css'

export default function Host(){
    const socket = useSocket();
    const {user, userName, loading} = useAuth();

    const [canStart, setCanStart] = useState(false);
    const [game, setGame] = useState(""); //Stores Game_id and Join_Code
    const [joinMessage, setJoinMessage] = useState("");
    const [messages, setMessages] = useState([]); 
    const [players, setPlayers] = useState([]);
    const [started, setStarted] = useState(false);
    const [lobbyMessage, setLobbyMessage] = useState(null);

    const createGame = async() => {
        if (loading) {
            console.log("Auth is still loading... waiting for user");
            return; // Stop the function until loading is done
        }
    
        if (!user) {
            console.log("No user found! Please log in first.");
            return;
        }

        try{
            const body = {Host_id: user};
            const response = await fetch(`http://localhost:3000/api/games/`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            if (!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            setGame(jsonData.data[0]);

        } catch(err) {
            console.log(err.message);
        }

        socket.on("host_permissions", (data) => {
            if (data.canStartGame) setCanStart(true);
            setLobbyMessage('You are the host. Waiting for players to join...');
            console.log(`Host permission granted. Game is ready to start`);
        });
    }

    const startGame = () => {
        if(canStart){
            socket.emit('start_game', { Game_id: game.Game_id });
            setCanStart(false);
        }
    }

    const destroyGame = () => {
        socket.emit('end_game', {Game_id: game.Game_id});
        console.log(`Destroying game ${game.Game_id ? game.Game_id : 'no game'}`);
    }

    //socket listener
    useEffect(()=>{
        socket.on('connect', ()=>{
            console.log('Connected to Socket.IO Server');
            setMessages((prevMessages) => [
                ...prevMessages,
                'Connected to Socket.IO Server.'
            ]);
        })

        socket.on('player_joined', (data)=>{
            setPlayers((prevPlayers) => [
                ...prevPlayers,
                { Username: data.Username, User_id: data.User_id }
            ]); 
            setMessages((prevMessages) => [
                ...prevMessages,
                `${data.Username} has joined the lobby.`
            ])
            console.log(`Player ${data.Username} joined lobby (Host: ${data.isHost})`);
        })

        socket.on('game_started', (data)=>{
            setMessages((prevMessages) => [
                ...prevMessages,
                'The game has started!'
            ]);
            console.log('Game has started!');
            setStarted(true);
        })

        socket.on('game_ended', (data)=>{
            setCanStart(false);
            setGame("");
            setMessages([]);
            setPlayers([]);
            setStarted(false);
        })

        return () => {
            socket.off('connect');
            socket.off('player_joined');
            socket.off('host_permissions');
            socket.off('game_started');
            socket.off('game_ended');
        };
        
    }, [socket]);

    useEffect(()=>{
        setJoinMessage(`Game created! Join code: ${game.Join_Code}`);
        socket.emit('join_lobby', { Game_id: game.Game_id, User_id: user, Username: userName });

    }, [game]);

    return(
        <Lobby>
            <Link to={'/join'} className={styles.menuButton}>Join</Link>
            <p>{joinMessage}</p>
            <button className={styles.menuButton} onClick={createGame}>Create Game</button>
            {canStart && <button className={styles.menuButton} onClick={startGame}>Start Game</button>}
            <button className={styles.menuButton} onClick={destroyGame}>End Game</button>

            <div className={styles.lobby}>
                <p>{lobbyMessage}</p>
                {messages.map((msg, index) => (
                        <div key={index}>{msg}</div>
                    ))} 
                {players.map((player, index) => (
                        <h1 key={index}>{player.name ? player.name : "Unknown Player"}</h1>
                ))}
            </div>
        </Lobby>

    );
}