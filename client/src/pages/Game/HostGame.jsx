import React, {useEffect, useRef, useState, useReducer} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import {useSocket} from '../../context/SocketContext.jsx';
import axios from 'axios';

//pages
import StartPage from './GameComponents/Pages/StartPage';
import QuestionPage from './GameComponents/Pages/QuestionPage';
import PostQuestionPage from './GameComponents/Pages/PostQuestionPage';
import LoadingPage from './GameComponents/Pages/LoadingPage';
import LeaderboardPage from './GameComponents/Pages/LeaderboardPage';
import PostGamePage from './GameComponents/Pages/PostGamePage';
import InfoBar from './GameComponents/Components/InfoBar';

//Game Logic
import {Leaderboard, Question} from './GameLogic';


const QuizPages = {
    START: "start",
    QUESTION: "question",
    POSTQUESTION: "postquestion",
    LOADING: "loading",
    LEADERBOARD: "leaderboard",
    POSTGAME: "postgame",
    ERROR: "error"
};

const initQuestion = new Question(
    "Default Question",
    "Default Answer 1",
    "Default Answer 2",
    "Default Answer 3",
    "Default Answer 4",
);

function HostGame() {
    // Contexts
    const params = useParams();
    const socket = useSocket();
    const navigate = useNavigate();
    const {user, userName, loading} = useAuth();

    // Variables
    const [card, setCard] = useState({});
    const [deckTitle, setDeckTitle] = useState("No title selected");
    const [timer, setTimer] = useState(1);
    const timerRef = useRef(null);
    const [joinCode, setJoinCode] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState( initQuestion);
    const [playerScore, setPlayerScore] = useState(0);
    const [playerData, setPlayerData] = useState({});
    const [isQuestionPageRendering, setIsQuestionPageRendering] = useState(false);

    // Initialization relevant variables
    const gameInitialized = useRef(false);
    const connectedPlayerCount = useRef(0);
    const gameStarted = useRef(false);
    const totalPlayerCount = useRef(0);
    const playerAnsweredCount = useRef(0);
    const isGameOver = useRef(false);

    //LB
    const leaderboardRef = useRef(new Leaderboard());
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    // Host Variables
    const [numPlayerAnswers, setNumPlayerAnswers] = useState(0);
    const isHost = true;
    const [state, setState] = useState(QuizPages.START);

    //Next Button Handler
    const nextButtonHandler = () => {
        switch (state) {
            case QuizPages.QUESTION || QuizPages.POSTQUESTION:
                setState(QuizPages.LEADERBOARD);
                break;
            case QuizPages.LEADERBOARD:
                getNextQuestion().then(r => setState(QuizPages.QUESTION));
                break;

        }
    };

    const getJoinCode = async() => {
        if(params.Game_id){
            try {
                const response = await axios.get(`/api/games/${params.Game_id}/game`);
                setJoinCode(response.data.Join_Code);
            } catch (error) {
                console.error(error.message);
            }
        }
    }

    /** @todo consolidate with profile and the others into a users hooks folder */
    const getUser = async() =>{
        try {
            const response = await axios.get(`/api/users/${user}`);
            setPlayerData(response.data);
        } catch (error) {
            console.error(error.message);
        }
    }

    const savePlayerData = async(newData) => {
        try{
            const response = await axios.put(`/api/users/${user}`, newData);
        } catch (error) {
            console.error(error.message);
        }
    }

    const updatePlayerData = async () =>{
        const updateScore = leaderboardRef.current.findPlayer(user).score;
        setPlayerData((prevData) => {
            const newData = {
                ...prevData,
                Games_Played: (prevData.Games_Played || 0) + 1,
                Wins: leaderboardRef.current.leaderboard[0] === user ? (prevData.Wins || 0) + 1 : prevData.Wins || 0,
                Total_Score: (prevData.Total_Score || 0) + updateScore,
                Highest_Score: updateScore > (prevData.Highest_Score || 0) ? updateScore: prevData.Highest_Score || 0,
                Highest_Score_id: updateScore > (prevData.Highest_Score || 0) ? deckTitle : prevData.Highest_Score_id,
            };

            savePlayerData(newData);
            return newData;
        });
    }

    const updatePlayer = (player) =>{ //fixme: bug on early exit if score does not yet exist.
        //leaderboardRef.current.updatePlayer(player.User_id, player.Player_score); //send in player.Username along with
        //if(player.Username === userName){
        //    setPlayerScore(player.Player_score);
        //}
    }

    const getNextQuestion = async() => {
        if(params){
            socket.emit('send_next_card', {Game_id: params.Game_id});
        }
    }

    const onQuestionSubmit = (AnswerID) => {
        socket.emit("submit_answer", {
            Game_id: params.Game_id,
            Player_id: user,
            Answer_id: AnswerID,
            Timer_Status: timerRef
        });
        console.log(`GameID: ${params.Game_id} Player_ID: ${user}, Answer_ID: ${AnswerID}, Timer_Status: ${timerRef}`);
    }

    const onTimerEnd = () => {
        console.log("Timer End");
        //socket.emit("submit_answer", {Game_id: params.Game_id, Player_id: user, Answer_Status: 0}); //This crashes the game!
        //nextState(true); //FIXME: pass in isTimerEnd=true, change state machine to go straight to leaderboard. also, make it so it only works in question mode
        setState(QuizPages.POSTQUESTION)
    }

    const exitToDashboard = () => {
        navigate("/dashboard");
    }

    /**@todo Update group data if flagged as group game */
    const handleGameEnd = () => {
        updatePlayerData();
        setState(QuizPages.POSTGAME);
    }

    const destroyGame = () => {
        handleGameEnd();
        socket.emit('end_game', {Game_id: params.Game_id});
        console.log(`Destroying game ${params.Game_id ? params.Game_id : 'no game'}`);
    }

    //socket listener
    useEffect(() => {
        //Game Initilization
        socket.on('init_game_part_1', ({playerList, playerCount}) => {
            if (gameInitialized.current) return;
            console.log(playerList);
            console.log(playerCount);
            for(let i = 0; i < playerList.length; i++){
                let player = playerList[i];
                leaderboardRef.current.registerPlayer(player.Username, player.User_id, 0);
                console.log(`Registering Player ${player.Username}`);
            }
            setPlayerScore(0);
            gameInitialized.current = true;
            totalPlayerCount.current = playerCount;
            forceUpdate();
        });

        socket.on('player_connect', ({Game_id, User_id}) => {
            if(leaderboardRef.current.findPlayer(User_id) && gameInitialized.current){
                connectedPlayerCount.current = connectedPlayerCount.current + 1;
                console.log(`Connected Player ${connectedPlayerCount.current} out of ${totalPlayerCount.current} players`);
                socket.emit('confirm_connection', {Game_id, User_id});
                forceUpdate();
                if(connectedPlayerCount.current === (totalPlayerCount.current - 1) ){
                    socket.emit('init_game_call_2', {Game_id});
                    gameStarted.current = true;
                    console.log("Game started");
                    forceUpdate();
                }
            } else {
                console.error("User not found in lb")
            }
            forceUpdate();
        })

        socket.on('card_for_client', (data) => {
            if(data.CardIndex === -999){
                handleGameEnd();
            }
            setCard(data.Card);
            setNumPlayerAnswers(0);

            setCurrentQuestion( new Question(
                data.Card.Question,
                data.Card.Answer,
                data.Card.Incorrect1,
                data.Card.Incorrect2,
                data.Card.Incorrect3
            ));
        })

        socket.on('question_ended', (data) => {
            data.Scores.map((player) => {
                updatePlayer(player);
            })
            setNumPlayerAnswers(0);
            playerAnsweredCount.current = 0;
        })

        //Scrap?
        socket.on('answer_submitted', (data) => {
            console.warn("Deprecated web socket call in use")
        })

        socket.on('game_settings', ({Deck_Title, Timer}) => {
            console.log("Game Settings Data");
            setDeckTitle(Deck_Title);
            setTimer(Timer);
        });

        socket.on('game_ended', (data)=>{
            setState(QuizPages.POSTGAME);
            handleGameEnd();
        });

        //Logic Sockets
        socket.on('check_answer', ({Player_id, Answer_id, position, totalPos}) => {
            console.log(`Checking answer for ${Player_id} AID: ${Answer_id} Pos: ${position} / ${totalPos}`);
            let score = currentQuestion.CalcPlayerScore(Answer_id, position, totalPos)
            leaderboardRef.current.updatePlayer(Player_id, score);
            let nScore = leaderboardRef.current.findPlayer(Player_id).score;

            playerAnsweredCount.current += 1
            forceUpdate();

            if (Player_id === user) {
                setPlayerScore(nScore);
                setState(QuizPages.POSTQUESTION);
            }
            socket.emit('broadcast_score', {Game_id: params.Game_id, Score: score, User_id: Player_id})

            if(position === totalPos){
                setState(QuizPages.LEADERBOARD)
            }
        });

            return () => {
            socket.off('card_for_client');
            socket.off('question_ended');
            socket.off('answer_submitted');
            socket.off('deck_title');
            socket.off('game_ended');
            socket.off('check_answer');
        };
    }, [socket]);

    //params listener
    useEffect(()=>{
        getJoinCode();
    }, [params]);

    const updateList = [QuizPages.LEADERBOARD, QuizPages.QUESTION, QuizPages.POSTGAME];
    //Update player clients on current state
    useEffect(() => {
        console.log("Emitting updated state:", state);
        console.log(`Is currentPage in updateList${state in updateList}`);
        console.warn(state);
        console.warn(updateList);
        if (updateList.includes(state)){
            socket.emit('send_current_state', {
                Game_id: params.Game_id,
                currentState: state,
                isGameOver: isGameOver.current,
            });
        }
        console.log("Socket send_current_state emitted");
        forceUpdate();
    }, [state]);



    //component mount listener
    useEffect(() => {
        //Allow the game to change states via the console,
        //e.g. setCurrentPage("loading")
        window.changeQuizState = (newState) => {
            if (Object.values(QuizPages).includes(newState)) {
                setState(newState);
                console.log(`State changed to ${newState}`);
            } else {
                console.error(`Invalid state: ${newState}`);
            }
        };

        //get deck title
        if(!isGameOver.current){
            socket.emit('get_game_settings', {Game_id: params.Game_id});
        }

        //get player data
        getUser();

        console.log("Initializing Game");
        socket.emit('init_game_call', { Game_id: params.Game_id, User_id: params.User_id });

        return () => {
            delete window.changeQuizState;
        };
    }, []);

    //99 little bugs in the code 99 little bugs
    //Take one down patch it around
    //942 little bugs in the code
    return (
        <div style={{ overflowY: 'hidden' }}>
            <header>
                <InfoBar
                    gameCode={joinCode}
                    deckName={deckTitle}
                    displayName={userName}
                    score={playerScore}
                    isHost={isHost}
                    onAdvance={nextButtonHandler}
                    onTimerEnd={onTimerEnd}
                    onEndGame={isGameOver.current ? exitToDashboard : destroyGame}
                    endGameText={isGameOver.current ? "Exit" : "End Game"}
                    timerRef={timerRef}
                    numPlayerAnswers={numPlayerAnswers}
                    isQuestionPageRendering={isQuestionPageRendering}
                    seconds={timer}
                />
            </header>
            <div>
                {state === QuizPages.START && <StartPage
                    everyoneConnected={gameStarted.current}
                    start={() => {
                        getNextQuestion().then(r => setState(QuizPages.QUESTION));
                        console.log("Starting game started");
                    }}/>}
                {state === QuizPages.QUESTION && <QuestionPage
                    question={currentQuestion}
                    onAnswer={onQuestionSubmit}
                    setIsQuestionPageRendering={setIsQuestionPageRendering}
                />}
                {state === QuizPages.POSTQUESTION && <PostQuestionPage/>}
                {state === QuizPages.LOADING && <LoadingPage/>}
                {state === QuizPages.LEADERBOARD && <LeaderboardPage
                    leaderboard={leaderboardRef.current}
                    setIsQuestionPageRendering={setIsQuestionPageRendering}
                />}
                {state === QuizPages.POSTGAME && <PostGamePage
                    leaderboard={leaderboardRef.current}
                    setIsQuestionPageRendering={setIsQuestionPageRendering}
                />}
                {state === QuizPages.ERROR &&
                    <h1>AN ERROR HAS OCCURRED AND THE DEVELOPER IS DRINKING PROFUSELY BECAUSE OF IT</h1>}
            </div>
        </div>
    );
}

export default HostGame;
