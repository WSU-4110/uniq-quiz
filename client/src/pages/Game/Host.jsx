import {useState, useEffect} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import {Link, Navigate} from 'react-router';
import Lobby from './Lobby.jsx';
import {useSocket} from '../../context/SocketContext.jsx';
import styles from '../../Stylesheets/Game/Join.module.css'
import { GameSettings } from './GameLogic';

export default function Host(){
    const socket = useSocket();
    const {user, userName, loading} = useAuth();

    const [canStart, setCanStart] = useState(false);
    const [game, setGame] = useState(""); //Stores Game_id and Join_Code
    const [joinMessage, setJoinMessage] = useState("");
    const [messages, setMessages] = useState([]); 
    const [players, setPlayers] = useState([]);
    const [started, setStarted] = useState(false);
    const [decks, setDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState({});
    const [lobbyMessage, setLobbyMessage] = useState(null);
    const [timer, setTimer] = useState(60);
    const [shuffleDecks, setShuffleDecks] = useState(false);

    /**@todo convert this to a separate hook for reuse with decks */
    const getDecks = async() =>{
        try {
            const response = await fetch("/api/decks/");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            const jsonData = await response.json();
            if(jsonData){
                setDecks(jsonData.filter(deck => deck.User_id === user));
                setSelectedDeck(jsonData.filter(deck => deck.User_id === user)[0]);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const getIsInActiveGame = async() => {
        try{
            const response = await fetch(`/api/games/${user}/host`);
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            if(jsonData){
                setGame(jsonData);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

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
            const response = await fetch(`/api/games/`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            if (!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            console.log(jsonData);
            console.log("FUCK MY LIFE");
            console.log(response);
            setGame(jsonData.data[0]);
            getDecks();

        } catch(err) {
            console.error(err);
        }

        socket.on("host_permissions", (data) => {
            if (data.canStartGame) setCanStart(true);
            setLobbyMessage('You are the host. Waiting for players to join...');
            console.log(`Host permission granted. Game is ready to start`);
        });
    }

    const updateTimer = (event) => {
        setTimer(event.target.value);
    }

    const startGame = () => {
        if(canStart){
            let gameSettings = new GameSettings(timer, shuffleDecks);
            localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
            //TODO: Store local storage, game starts get from local storage
            console.log("game id", game.Game_id);
            socket.emit('start_game', { Game_id: game.Game_id });
            setCanStart(false);
            setStarted(true); //DEBUG
        }
    }

    const destroyGame = () => {
        socket.emit('end_game', {Game_id: game.Game_id});
        console.log(`Destroying game ${game.Game_id ? game.Game_id : 'no game'}`);
    }

    const selectDeck = (deck) =>{
        setSelectedDeck(deck);
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
            console.log("message:", data.message);
            setJoinMessage("");
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

    //game update listener
    useEffect(()=>{
        setJoinMessage(`Game created! Join code: ${game.Join_Code}`);
        socket.emit('join_lobby', { Game_id: game.Game_id, User_id: user, Username: userName });

    }, [game]);

    //deck select listener
    useEffect(()=>{
        if(selectedDeck?.Deck_id){
            socket.emit('deck_selected', { Game_id: game.Game_id, Deck_id: selectedDeck.Deck_id });
        }
    }, [selectedDeck])

    //component mount listener
    useEffect(()=>{
        getIsInActiveGame();
        getDecks();
    }, []);

    return(<>
        {started && <Navigate to={`/host/${game.Game_id}`} replace />}
        <Lobby started={setStarted}>
            <Link to={'/join'} className={styles.menuButton}>Join</Link>
            <p>{joinMessage}</p>
            <button className={styles.menuButton} onClick={()=>{setCanStart(true)}}>debug</button>
            <button className={styles.menuButton} onClick={createGame}>Create Game</button>
            {canStart && <button className={styles.menuButton} onClick={startGame}>Start Game</button>}
            <button className={styles.menuButton} onClick={destroyGame}>End Game</button>

            <div>
                <label for="decks">Choose a deck:</label>
                <select onChange={(e) => selectDeck(decks[e.target.selectedIndex])}>
                    {decks.sort((a,b) => a.Title > b.Title ? 1 : -1)
                    .map((deck, index) => (
                        <option key={deck.Deck_id ? deck.Deck_id : index} value={deck.Title}>
                            {deck.Title ? deck.Title : "Untitled Deck"}
                        </option>
                    ))}
                </select>
                <p>{selectedDeck.Title ? selectedDeck.Title : "no deck selected"}</p>
                <div>
                    <div>
                        <input type="range" name="timer" min="1" max="220" value={timer} onChange={updateTimer} />
                        <input type="number" name="timerNum" min="1" max="220" value={timer} onChange={updateTimer} />
                    </div>
                    <div>
                        <label htmlFor="shuffleTure">Shuffle Deck</label>
                        <input type="radio" id="shuffleTure" name="shuffle" value="true" onClick={() => setShuffleDecks(true)}/>
                        <label htmlFor="shuffleFalse">Don't Shuffle Deck</label>
                        <input type="radio" id="shuffleFalse" name="shuffle" value="false" onClick={() => setShuffleDecks(true)} defaultChecked />
                    </div>
                </div>
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
        </Lobby>

    </>);
}