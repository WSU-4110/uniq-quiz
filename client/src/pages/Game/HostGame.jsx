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

const quizReducer = (state, action) =>{
    switch (action.type){
        case 'START':
            return {...state, currentPage: QuizPages.LOADING};
        case 'LOADING':
            return {...state, currentPage: QuizPages.QUESTION};
        case 'QUESTION':
            return{
                ...state,
                currentPage: action.isHost ? QuizPages.LEADERBOARD : QuizPages.POSTQUESTIONPAGE //FIXME: this makes no sense. what if the host submits before everyone else?
            };
        case 'POSTQUESTION':
            return{
                ...state,
                currentPage: action.isHost ? (state.isGameOver ? QuizPages.POSTGAME : QuizPages.LEADERBOARD) : state.currentPage
            }
        case 'LEADERBOARD':
            return{
                ...state,
                currentPage: state.isGameOver ? QuizPages.POSTGAME : QuizPages.QUESTION
            }
        case 'POSTGAME':
            return {...state, currentPage: QuizPages.POSTGAME, isGameOver: true}
        case "ERROR":
            return { ...state, currentPage: QuizPages.ERROR };
        default:
            return state;
    }
}

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

    const leaderboardRef = useRef(new Leaderboard());
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    // Host Variables
    const [numPlayerAnswers, setNumPlayerAnswers] = useState(0);
    const isHost = true;

    // Reducer
    const [state, dispatch] = useReducer(quizReducer, {
        currentPage: QuizPages.START,
        isGameOver: false
    })

    // State Machine
    const nextState = (isHost, isTimerEnd=false) => {
        console.log("In nextState, current page " + state.currentPage);
        switch (state.currentPage) {
            case QuizPages.START:
                dispatch({type: 'START'});
                break;
            case QuizPages.QUESTION:
                dispatch({type: 'QUESTION', isHost});
                break;
            case QuizPages.POSTQUESTION:
                dispatch({type: 'POSTQUESTION', isHost});
                break;
            case QuizPages.LOADING:
                getNextQuestion();
                dispatch({type: 'LOADING'});
                break;
            case QuizPages.LEADERBOARD:
                if (state.isGameOver) {
                    socket.emit('end_question', {Game_id: params.Game_id});
                    dispatch({ type: "POSTGAME" });
                } else {
                    getNextQuestion();
                    dispatch({ type: "LEADERBOARD" });
                }
                break;
            default:
                dispatch({ type: "ERROR" });
                break;
        }
    }

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
        nextState(true);
    }

    const onTimerEnd = () => {
        console.log("Timer End");
        //socket.emit("submit_answer", {Game_id: params.Game_id, Player_id: user, Answer_Status: 0}); //This crashes the game!
        nextState(true); //FIXME: pass in isTimerEnd=true, change state machine to go straight to leaderboard. also, make it so it only works in question mode
    }

    const exitToDashboard = () => {
        navigate("/dashboard");
    }

    /**@todo Update group data if flagged as group game */
    const handleGameEnd = () => {
        updatePlayerData();
        dispatch({ type: 'POSTGAME' }); //@todo: is this doing anything?
    }

    const destroyGame = () => {
        handleGameEnd();
        socket.emit('end_game', {Game_id: params.Game_id});
        console.log(`Destroying game ${params.Game_id ? params.Game_id : 'no game'}`);
    }

    //socket listener
    useEffect(() => {
        socket.on('init_game', ({playerList}) => {
            console.log('init_game');
            console.log(playerList);
            let players = playerList;
            for(let i = 0; i < players.length; i++){
                let player = players[i];
                leaderboardRef.current.registerPlayer(player.Username, player.User_id, 0);
                console.log(`Registering Player ${player.Username}`);
            }
            setPlayerScore(0);
            forceUpdate();
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
        })

        socket.on('question_ended', (data) => {
            data.Scores.map((player) => {
                updatePlayer(player);
            })
            setNumPlayerAnswers(0);
        })

        socket.on('answer_submitted', (data) => {
            if(data.AllSubmitted){
                socket.emit('end_question', {Game_id: params.Game_id}); //If consolidated: put this under isHost
                nextState(true);
            }else{
                setNumPlayerAnswers(prevNumPlayerAnswers => prevNumPlayerAnswers + 1);
            }
        })

        socket.on('game_settings', ({Deck_Title, Timer}) => {
            console.log("Game Settings Data");
            setDeckTitle(Deck_Title);
            setTimer(Timer);
        })

        socket.on('game_ended', (data)=>{
            nextState(true);
            handleGameEnd();
        });

        //Logic Sockets
        socket.on('check_answer', ({Player_id, Answer_id, position, totalPos}) => {
            let score = currentQuestion.CalcPlayerScore(Answer_id, position, totalPos)
            leaderboardRef.current.updatePlayer(Player_id, score);
            console.log(`IN check_answer  - ${Player_id} Score: ${score}`);
            let nScore = leaderboardRef.current.findPlayer(Player_id).score ;
            console.warn(`pScore: ${nScore} Score: ${score} UPDATE`);

            console.log(`User_ID ${playerData.User_id}`)
            if (Player_id === user) {
                console.log("PID Match, update score AI SOL")
                setPlayerScore(nScore);
            }

            if (Player_id === playerData.User_id){
                console.log("PID Match, update score")
                setPlayerScore(nScore);
            }
            //socket.emit('broadcast_score', {Game_id: params.Game_id, Score: score, User_id: Player_id})
        });

            return () => {
            socket.off('card_for_client');
            socket.off('question_ended');
            socket.off('answer_submitted');
            socket.off('deck_title');
            socket.off('game_ended');
        };
    }, [socket]);

    //params listener
    useEffect(()=>{
        getJoinCode();
    }, [params]);

    //Update player clients on current state
    useEffect(() => {
        console.log("Emitting updated state:", state);
        socket.emit('send_current_state', {
            Game_id: params.Game_id,
            currentState: state.currentPage,
            isGameOver: state.isGameOver,
        });
        console.log("Socket send_current_state emitted");
    }, [state]);



    //component mount listener
    useEffect(() => {
        //Allow the game to change states via the console,
        //e.g. setCurrentPage("loading")
        window.changeQuizState = (newState) => {
            if (Object.values(QuizPages).includes(newState)) {
                dispatch({type: newState});
                console.log(`State changed to ${newState}`);
            } else {
                console.error(`Invalid state: ${newState}`);
            }
        };

        //get deck title
        if(!state.isGameOver){
            socket.emit('get_game_settings', {Game_id: params.Game_id});
        }

        console.log("Initializing Game");
        socket.emit('init_game_server', { Game_id: params.Game_id });

        //get player data
        getUser();

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
                    onAdvance={nextState}
                    onTimerEnd={onTimerEnd}
                    onEndGame={state.isGameOver ? exitToDashboard : destroyGame}
                    endGameText={state.isGameOver ? "Exit" : "End Game"}
                    timerRef={timerRef}
                    numPlayerAnswers={numPlayerAnswers}
                    isQuestionPageRendering={isQuestionPageRendering}
                    seconds={timer}
                />
            </header>
            <div>
                {state.currentPage === QuizPages.START && <StartPage/>}
                {state.currentPage === QuizPages.QUESTION && <QuestionPage
                    question={currentQuestion}
                    onAnswer={onQuestionSubmit}
                    setIsQuestionPageRendering={setIsQuestionPageRendering}
                />}
                {state.currentPage === QuizPages.POSTQUESTION && <PostQuestionPage/>}
                {state.currentPage === QuizPages.LOADING && <LoadingPage/>}
                {state.currentPage === QuizPages.LEADERBOARD && <LeaderboardPage
                    leaderboard={leaderboardRef.current}
                    setIsQuestionPageRendering={setIsQuestionPageRendering}
                />}
                {state.currentPage === QuizPages.POSTGAME && <PostGamePage
                    leaderboard={leaderboardRef.current}
                />}
                {state.currentPage === QuizPages.ERROR &&
                    <h1>AN ERROR HAS OCCURRED AND THE DEVELOPER IS DRINKING PROFUSELY BECAUSE OF IT</h1>}
            </div>
        </div>
    );
}

export default HostGame;
