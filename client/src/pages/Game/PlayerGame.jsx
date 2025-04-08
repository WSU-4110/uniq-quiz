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
    1
);

function PlayerGame() {
    // Contexts
    const params = useParams();
    const socket = useSocket();
    const navigate = useNavigate();
    const {user, userName, loading} = useAuth();

    // Variables
    const [leaderboard, setLeaderboard] = useState(new Leaderboard());
    const [card, setCard] = useState({});
    const [deckTitle, setDeckTitle] = useState("No title selected");
    const [timer, setTimer] = useState(1);
    const [joinCode, setJoinCode] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState( initQuestion);
    const timerRef = useRef(null);
    const [playerScore, setPlayerScore] = useState(0);
    const [playerData, setPlayerData] = useState({});
    const [isQuestionPageRendering, setIsQuestionPageRendering] = useState(false);
    const [currentState, setCurrentState] = useState(QuizPages.START);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameInitilized, setGameInitilized] = useState(false);
    const leaderboardRef = useRef(new Leaderboard());
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [connected, setConnected] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const maxAttempts = 30;


    // Player Variables
    const isHost = false;

    const getJoinCode = async() => {
        if(params.Game_id){
            try {
                const response = await axios.get(`/api/games/${params.Game_id}/game`);
                setJoinCode(response.data.Join_Code);
                console.log(response.data);
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
            params.User_id = response.data.User_id;
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
        const updateScore = leaderboard.findPlayer(user).score;
        setPlayerData((prevData) => {
            const newData = {
                ...prevData,
                Games_Played: (prevData.Games_Played || 0) + 1,
                Wins: leaderboard.leaderboard[0] === user ? (prevData.Wins || 0) + 1 : prevData.Wins || 0,
                Total_Score: (prevData.Total_Score || 0) + updateScore,
                Highest_Score: updateScore > (prevData.Highest_Score || 0) ? updateScore: prevData.Highest_Score || 0,
                Highest_Score_id: updateScore > (prevData.Highest_Score || 0) ? deckTitle : prevData.Highest_Score_id,
            };

            savePlayerData(newData);
            return newData;
        });
    }

    const updatePlayer = (player) =>{
        leaderboard.updatePlayer(player.name, player.score);
        if(player.Username === userName){
            setPlayerScore(player.Player_score); //TODO: ?
        }
    }

    const getNextQuestion = async() => {
        if(params){
            socket.emit('send_next_card', {Game_id: params.Game_id});
        }
    }

    const onQuestionSubmit = (AnswerID) => {
        setCurrentState(QuizPages.POSTQUESTION)
        socket.emit("submit_answer", {
            Game_id: params.Game_id,
            Player_id: user,
            Answer_Status: currentQuestion.CheckAnswer(AnswerID),
            Timer_Status: timerRef
        });
    }

    const onTimerEnd = () => {
        console.log("Timer End");
        //socket.emit("submit_answer", {Game_id: params.Game_id, Player_id: user, Answer_Status: 0}); //This crashes the game!
        setCurrentState(QuizPages.LOADING);
    }

    const exitToDashboard = () => {
        handleGameEnd();
        navigate("/dashboard");
    }

    const handleGameEnd = () => {
        updatePlayerData();
        setCurrentState(QuizPages.POSTGAME);
    }

    //socket listener
    useEffect(() => {
        //Initialize game
        socket.on('player_confirm', ({Game_id, User_id}) => {
           if (User_id === params.User_id) {
                setConnected(true);
           }
        });

        socket.on('init_game_part_2', ({playerList}) => {
            let players = playerList;
            for(let i = 0; i < players.length; i++){
                let player = players[i];
                leaderboardRef.current.registerPlayer(player.Username, player.User_id, 0);
                console.log(`Registering Player ${player.Username}`);
            }
            setPlayerScore(0);
            forceUpdate();
            setGameInitilized(true);
        });

        socket.on('card_for_client', (data) => {
            if(data.CardIndex === -999){
                handleGameEnd();
            }
            setCard(data.Card);

            setCurrentQuestion( new Question(
                data.Card.Question,
                data.Card.Answer,
                data.Card.Incorrect1,
                data.Card.Incorrect2,
                data.Card.Incorrect3
            ));

            //nextState(false);
        })

        socket.on('question_ended', (data)=>{
            console.log(data.Scores);
            data.Scores.map((player) => {
                updatePlayer(player);
            })
        })

        socket.on('game_settings', (data) => {
            if(data){
                setDeckTitle(data.Title);
                setTimer(data.Timer);
            }
        })

        socket.on('deck_title', (data) => {
            if(data){
                setDeckTitle(data.Title);
            }
        })

        socket.on('game_ended', (data)=>{
            setCurrentState(QuizPages.POSTGAME);
            handleGameEnd();
        });

        socket.on('broadcast_score_client', ({User_id, Score}) => {
            console.log(`Updating user score ${User_id} ${Score}`);
            leaderboardRef.current.updatePlayer(User_id, Score);
            forceUpdate();
        })

        socket.on('get_current_state', (data) => {
            setCurrentState(data.currentState);
            setIsGameOver(data.isGameOver);
            console.log(`Current state being set to ${data.currentState}`);
        })

        return () => {
            socket.off('card_for_client');
            socket.off('question_ended');
            socket.off('deck_title');
            socket.off('game_ended');
            socket.off('get_current_state');
        };
    }, [socket]);

    //Connection retry
    useEffect(() => {
        if(maxAttempts === attempts){
            setCurrentState(QuizPages.ERROR);
        }
        if (!connected && attempts < maxAttempts) {
            const intervalId = setInterval(() => {
                if (!connected) {
                    console.log(`Attempt ${attempts + 1} to connect...`);
                    socket.emit('connect_game', { Game_id: params.Game_id, User_id: params.User_id });
                    setAttempts(prev => prev + 1);
                }
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [connected, attempts, socket, params.Game_id, params.User_id]);

    //params listener
    useEffect(()=>{
        getJoinCode();
    }, [params]);

    //component mount listener
    useEffect(() => {
        //Allow the game to change states via the console,
        //e.g. setCurrentPage("loading")
        window.changeQuizState = (newState) => {
            console.error("Operation invalid, player client active")
        };

        //get deck title
        if(!isGameOver)
            socket.emit('get_deck_title', {Game_id: params.Game_id});

        //get player data
        getUser();

        console.log("Initializing Game");
        socket.emit('connect_game', {Game_id: params.Game_id, User_id: params.User_id});


        return () => {
            delete window.changeQuizState;
        };
    }, []);

    //99 little bugs in the code 99 little bugs
    //Take one down patch it around
    //943 little bugs in the code
    return (
        <div style={{ overflowY: 'hidden' }}>

            <header>
                <InfoBar
                    gameCode={joinCode}
                    deckName={deckTitle}
                    displayName={userName}
                    score={playerScore}
                    isHost={isHost}
                    onAdvance={() => {console.error("Player Client Active, No State Machine")}}
                    onEndGame={exitToDashboard}
                    onTimerEnd={onTimerEnd}
                    timerRef={timerRef}
                    isQuestionPageRendering={isQuestionPageRendering}
                    seconds={timer}
                />
            </header>
            <div>
                {currentState === QuizPages.START && <StartPage/>}
                {currentState === QuizPages.QUESTION && <QuestionPage
                    question={currentQuestion}
                    onAnswer={onQuestionSubmit}
                    setIsQuestionPageRendering={setIsQuestionPageRendering}
                />}
                {currentState === QuizPages.POSTQUESTION && <PostQuestionPage/>}
                {currentState === QuizPages.LOADING && <LoadingPage/>}
                {currentState === QuizPages.LEADERBOARD && <LeaderboardPage
                    leaderboard={leaderboardRef.current}
                    setIsQuestionPageRendering={setIsQuestionPageRendering}
                />}
                {currentState === QuizPages.POSTGAME && <PostGamePage
                    leaderboard={leaderboard}
                />}
                {currentState === QuizPages.ERROR &&
                    <h1>Hey there bud, you have timed out, you know what that means? It means the developer in charged of this is a fucking dumb piece of shit.</h1>}
            </div>
        </div>
    );
}

export default PlayerGame;