import {useState, useEffect} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import LobbyHeader from './LobbyHeader.jsx';
import {useSocket} from '../../context/SocketContext.jsx';
import styles from '../../Stylesheets/Game/Join.module.css'
import axios from "axios";

export default function Join(){
    const {user, userName, loading} = useAuth();
    const socket = useSocket();
    const navigate = useNavigate();

    const [joinCode, setJoinCode] = useState("");
    const [messages, setMessages] = useState([]); 
    const [game, setGame] = useState({});
    const [joinSuccessful, setJoinSuccessful] = useState(false);
    const [started, setStarted] = useState(false);
    const [lobbyMessage, setLobbyMessage] = useState(null);

    const joinGame = async(e) => {
        e.preventDefault(); //form automatically reloads page
        if(joinCode){
            try {
                const response = await axios.get(`/api/games/${joinCode}/join`);
                const jsonData = await response.data;
                console.log(jsonData);
                setGame(jsonData);
                socket.emit('join_lobby', { Game_id: jsonData.Game_id, User_id: user, Username: userName });
                setLobbyMessage('Waiting for the host to start the game...');
                console.log(`Joined game: ${joinCode}`);
            } catch (error) {
                console.error(error.message);
            }
        }
    }

    useEffect(()=>{
        socket.on('connect', ()=>{
            console.log('Connected to Socket.IO Server');
            setMessages((prevMessages) => [
                ...prevMessages,
                'Connected to Socket.IO Server'
            ]);
        })

        socket.on('player_joined', (data)=>{
            setJoinSuccessful(true);
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
            setJoinCode("");
            setMessages([]);
            setJoinSuccessful(false);
            setStarted(false);
            setGame({});
        })

        return () => {
            socket.off('connect');
            socket.off('player_joined');
            socket.off('host_permissions');
            socket.off('game_started');
            socket.off('game_ended');
        };

    }, [socket]);

    return(<>
        {started && <Navigate to={`/join/${game.Game_id}`} replace />}
        <LobbyHeader onClick={()=>{navigate("/host/start");}} caption={'HOST'}/>
            <div className={styles.page}>
                <form onSubmit={joinGame}>
                    <label htmlFor="Join Code"/><br/>
                    <input type="text" id="join_code" name="join code" value={joinCode} placeholder="JOIN CODE"
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())} required/>
                    {!joinSuccessful && <button className={styles.menuButton} type="submit">Go</button>}
                </form>
                <div className={styles.lobby}>
                    <p>{lobbyMessage}</p>
                    {messages.map((msg, index) => (
                            <div key={index}>{msg}</div>
                        ))} 
                </div>
            </div>
    </>);
}