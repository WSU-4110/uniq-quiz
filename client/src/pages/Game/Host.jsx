import {useState, useEffect} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import {Link, Navigate} from 'react-router';
import Lobby from './LobbyHeader.jsx';
import {useSocket} from '../../context/SocketContext.jsx';
import styles from '../../Stylesheets/Game/Host.module.css'
import axios from 'axios';
import { GameSettings, Leaderboard } from './GameLogic';

export default function Host(){
    // Contexts
    const socket = useSocket();
    const {user, userName, loading} = useAuth();

    // Game customization variables
    const [decks, setDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState({});
    const [timer, setTimer] = useState(60);
    const [shuffleDeck, setShuffleDeck] = useState(false);
    const [gameSettings, setGameSettings] = useState(new GameSettings(60));

    // Game logic variables
    const [game, setGame] = useState({}); //Stores Game_id and Join_Code
    const [canStart, setCanStart] = useState(false);
    const [players, setPlayers] = useState([]);
    const [started, setStarted] = useState(false);
    const [leaderboard, setLeaderboard] = useState(new Leaderboard());

    // UI variables
    const [joinMessage, setJoinMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [lobbyMessage, setLobbyMessage] = useState(null);
    const [selectError, setSelectError] = useState(false);
    const [mode, setMode] = useState("Info");


    /**@todo convert this to a separate hook for reuse with decks */
    const getDecks = async() =>{
        try {
            const response = await axios.get("/api/decks/");
            setDecks(response.data.filter(deck => deck.User_id === user));
        } catch (error) {
            console.error(error.message);
        }
    }

    const getIsInActiveGame = async() => {
        try{
            const response = await axios.get(`/api/games/${user}/host`);
            if(response.data){
                setGame(response.data);
                return true;
            }
            return false;
        } catch (error) {
            console.error(error.message);
        }
    }

    const createGame = async() => {
        if (loading || !user) return;
    
        if(!selectedDeck.Title || !timer){
            setSelectError(true);
            return;
        }

        if(await getIsInActiveGame()){
            destroyGame();
        }

        try{
            const response = await axios.post("/api/games/", {Host_id: user});
            setGame(response.data.data[0]);
            setMode("Lobby");
            setGameSettings(new GameSettings(timer, selectedDeck, shuffleDeck));

        } catch(err) {
            console.error(err);
        }
    }

    const updateTimer = (event) => {
        setTimer(event.target.value);
    }

    const startGame = () => {
        if(canStart && selectedDeck.Title){
            console.log("Starting game:", game.Game_id);
            setGameSettings(new GameSettings(timer, selectedDeck));
            socket.emit('start_game', { Game_id: game.Game_id });
            setCanStart(false);
        }
    }
        
    const destroyGame = () => {
        if(game.Game_id){
            socket.emit('end_game', {Game_id: game.Game_id});
            setMode("Info");
            setMessages([]);
            setLobbyMessage("");
            console.log(`Destroying game ${game.Game_id}`);
        }
    }

    const selectDeck = (deck) =>{
        if(deck)
            setSelectedDeck(deck);
        else
            setSelectedDeck({});
        console.log("Selected deck:", deck);
    }

    //socket listener
    useEffect(()=>{
        socket.on('connect', ()=>{
            console.log('Connected to Socket.IO Server');
            setMessages((prevMessages) => [
                ...prevMessages,
                'Connected to Socket.IO Server.'
            ]);
            getIsInActiveGame();
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
            leaderboard.registerPlayer(data.Username);
        })

        socket.on("host_permissions", (data) => {
            if (data.canStartGame) setCanStart(true);
            setLobbyMessage('You are the host. Waiting for players to join...');
            console.log(`Host permission granted. Game is ready to start`);
        });

        socket.on("game_settings", (data)=>{
            console.log(data);
        });

        socket.on('game_started', (data)=>{
            setMessages((prevMessages) => [
                ...prevMessages,
                'The game has started!'
            ]);
            console.log('Game has started!');
            setStarted(true);
        });

        socket.on('game_ended', (data)=>{
            console.log("message:", data.message);
            setJoinMessage("");
            setCanStart(false);
            setGame({});
            setMessages([]);
            setPlayers([]);
            setStarted(false);
        });

        return () => {
            socket.off('connect');
            socket.off('player_joined');
            socket.off('host_permissions');
            socket.off('game_settings');
            socket.off('game_started');
            socket.off('game_ended');
        };
        
    }, [socket]);

    //game update listener
    useEffect(()=>{
        if(game.Join_Code){
            setJoinMessage(`Game created! Join code: ${game.Join_Code}`);
            socket.emit('join_lobby', { Game_id: game.Game_id, User_id: user, Username: userName });
        }

    }, [game]);

    //canStart listener
    useEffect(()=>{
        if(canStart){
            if(gameSettings.selectedDeck != null){
                //Send game data to back-end
                console.log("Sending this data:", gameSettings);
                if(gameSettings?.selectedDeck.Deck_id && gameSettings?.timePerQuestion){
                    console.log("right before emit:", game.Game_id, gameSettings);
                    socket.emit('game_settings_selected', { Game_id: game.Game_id, Game_Settings: gameSettings });
                }else{
                    setSelectError(true);
                    console.log("Game settings error in Host.jsx.");
                    destroyGame();
                }
            }else{
                destroyGame();
            }
        }
    }, [canStart])

    //component mount listener
    useEffect(()=>{
        getDecks();
        getIsInActiveGame();
    }, []);

    return(<>
        {started && <Navigate to={`/host/${game.Game_id}`} replace />}
        <Lobby started={setStarted} />
            <Link to={'/join'} className={styles.menuButton}>Join</Link>
            {mode === "Info" && 
                <div className={styles.InfoBlockEx}>
                    <div className={styles.deckSelect}>
                        <label for="decks">Choose a deck:</label>
                        <select onChange={(e) => {selectDeck(decks[e.target.selectedIndex-1]); setSelectError(false)}}>
                            <option key ={-1} value="">
                                --No Deck Selected--
                            </option>
                            {decks.sort((a,b) => a.Title > b.Title ? 1 : -1)
                            .map((deck, index) => (
                                <option key={deck.Deck_id ? deck.Deck_id : index} value={deck.Title}>
                                    {deck.Title ? deck.Title : "Untitled Deck"}
                                </option>
                            ))}
                        </select>
                        {selectError && <p>Please fill in all information before selecting a deck.</p>}
                    </div>
                    <div className={styles.timerSelect}>
                        <input type="range" name="timer" min="1" max="220" value={timer} onChange={updateTimer} />
                        <input type="number" name="timerNum" min="1" max="220" value={timer} onChange={updateTimer} />
                    </div>
                    <div className={styles.shuffleSelect}>
                        <label htmlFor="shuffleTrue">Shuffle Deck</label>
                        <input type="radio" id="shuffleTrue" name="shuffle" value="true" onClick={() => setShuffleDeck(true)}/>
                        <label htmlFor="shuffleFalse">Don't Shuffle Deck</label>
                        <input type="radio" id="shuffleFalse" name="shuffle" value="false" onClick={() => setShuffleDeck(false)} defaultChecked />
                    </div>

                    <button className={selectedDeck.Title ? styles.menuButton : styles.menuButtonDisabled} onClick={createGame}>Create Game</button>
                </div>
            }
            {mode === "Lobby" && 
                <div className={styles.InfoBlock}>
                    <h2>Deck Title: {selectedDeck.Title}</h2>
                    <h2>Join Code: {game.Join_Code}</h2>
                </div>
            }

            <div className={styles.lobbyBlock}>
                <div className={styles.buttonContainer}>
                    <p>{joinMessage}</p>
                    <button className={styles.menuButton} onClick={()=>{setCanStart(true)}}>debug</button>
                    {canStart && <button className={styles.menuButton} onClick={startGame}>Start Game</button>}
                    <button className={styles.menuButton} onClick={destroyGame}>End Game</button>
                </div>
                <div className={styles.lobby}>
                    <p>{lobbyMessage}</p>
                    {messages.map((msg, index) => (
                            <div key={index}>{msg}</div>
                        ))} 
                    {players.map((player, index) => (
                            <h1 key={index}>{player.Username ? player.Username : "Unknown Player"}</h1>
                    ))}
                </div>
            </div>

    </>);
}