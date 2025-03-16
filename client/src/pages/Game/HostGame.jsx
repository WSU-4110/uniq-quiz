import React, {useEffect, useRef, useState} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import {useSocket} from '../../context/SocketContext.jsx';

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

function HostGame() {
    // Contexts
    const params = useParams();
    const socket = useSocket();
    const navigate = useNavigate();
    const {user, userName, loading} = useAuth();

    // Variables
    const [leaderboard, setLeaderboard] = useState(new Leaderboard());
    const [refresh, setRefresh] = useState(0);
    const [currentPage, setCurrentPage] = useState(QuizPages.START);
    const [card, setCard] = useState({});
    const [deckTitle, setDeckTitle] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState( initQuestion);
    const timerRef = useRef(null);
    const [playerScore, setPlayerScore] = useState(0);
    const [playerData, setPlayerData] = useState({});

    // Host Variables
    const [numPlayerAnswers, setNumPlayerAnswers] = useState(0);
    const isHost = true;

    const getJoinCode = async() => {
        if(params.Game_id){
            try {
                const response = await fetch(`http://localhost:3000/api/games/${params.Game_id}/game`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const jsonData = await response.json();
                setJoinCode(jsonData.Join_Code);
            } catch (error) {
                console.error(error.message);
            }
        }
    }

    /** @todo consolidate with profile and the others into a users hooks folder */
    const getUser = async() =>{
        try {
            const response = await fetch(`http://localhost:3000/api/users/${user}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            const jsonData = await response.json();
            setPlayerData(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    }

    const savePlayerData = async(newData) => {
        try{
            const response = await fetch(`http://localhost:3000/api/users/${user}`,{
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(newData)
            });
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = response.json();
            console.log("save player data:", jsonData);
        } catch (error) {
            console.error(error.message);
        }
    }

    const updatePlayerData = async () =>{
        console.log("updatePlayerData playerscore: ", playerScore);
        setPlayerData((prevData) => {
            const newData = {
                ...prevData,
                Games_Played: (prevData.Games_Played || 0) + 1,
                Wins: leaderboard.leaderboard[0] === user ? (prevData.Wins || 0) + 1 : prevData.Wins || 0,
                Total_Score: (prevData.Total_Score || 0) + playerScore,
                Highest_Score: playerScore > (prevData.Highest_Score || 0) ? playerScore : prevData.Highest_Score || 0,
                Highest_Score_id: playerScore > (prevData.Highest_Score || 0) ? deckTitle : prevData.Highest_Score_id,
            };
    
            savePlayerData(newData);
            console.log("newDAta", newData);
            return newData;
        });
    }
    
    const getNextQuestion = async() => {
        if(params){
            socket.emit('send_next_card', {Game_id: params.Game_id});
        }
    }

    const updatePlayer = (player) =>{
        console.log("updatePlayer playerscore: ", playerScore);
        leaderboard.updatePlayer(player.User_id, player.Player_score);
        if(player.User_id === user){
            console.log("updating!!! playerscorez: ", player.Player_score);
            setPlayerScore(player.Player_score);
        }
        setRefresh(r => r + 1);
    }

    useEffect(()=>{
        console.log("Player Score Updated: ", playerScore);
    }, [playerScore]);

    /**@todo Update group data if flagged as group game */
    const handleGameEnd = () => {
        console.log("handleGameEnd playerscore: ", playerScore);
        updatePlayerData();
        setIsGameOver(true);
    }

    const exitToDashboard = () => {
        navigate("/dashboard");
    }

    /**@todo duplicate function with Host. Export to hooks */
    const destroyGame = () => {
        console.log("destroyGame playerscore: ", playerScore);
        setIsGameOver(true);
        setCurrentPage(QuizPages.POSTGAME);
        socket.emit('end_game', {Game_id: params.Game_id});
        console.log("destroyGame2 playerscore: ", playerScore);
        console.log(`Destroying game ${params.Game_id ? params.Game_id : 'no game'}`);
    }

    //socket listener
    useEffect(() => {
        socket.on('card_for_client', (data) => {
            console.log("card for client playerscore: ", playerScore);
            setCard(data.Card);

            setCurrentQuestion( new Question(
                data.Card.Question,
                data.Card.Answer,
                data.Card.Incorrect1,
                data.Card.Incorrect2,
                data.Card.Incorrect3
            ));

            if(data.CardIndex === -999){
                destroyGame();
            }
        })

        socket.on('question_ended', (data) => {
            console.log("question_ended playerSCore: ", playerScore);
            data.Scores.map((player) => {
                updatePlayer(player);
            })
            setNumPlayerAnswers(0);
        })

        socket.on('answer_submitted', (data) => {
            console.log("answer submitted playerscore: ", playerScore);
            if(data.AllSubmitted){
                nextState(true);
            }else{
                setNumPlayerAnswers(prevNumPlayerAnswers => prevNumPlayerAnswers + 1);
            }
        })

        socket.on('deck_title', (data) => {
            console.log("deck title playerscore: ", playerScore);
            if(data){
                setDeckTitle(data.Title);
            }
        })

        socket.on('game_ended', (data)=>{
            console.log("game_ended playerscore: ", playerScore);
            handleGameEnd();
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

    //component mount listener
    useEffect(() => {
        //Allow the game to change states via the console,
        //e.g. setCurrentPage("loading")
        window.changeQuizState = (newState) => {
            if (Object.values(QuizPages).includes(newState)) {
                setCurrentPage(newState);
                console.log(`State changed to ${newState}`);
            } else {
                console.error(`Invalid state: ${newState}`);
            }
        };

        //get deck title
        if(!isGameOver)
            socket.emit('get_deck_title', {Game_id: params.Game_id});

        //get player data
        getUser();

        return () => {
            delete window.changeQuizState;
        };
    }, []);

    //This is the logic for the host to change between different states
    //TODO: Completely overhaul this
    //Good code this is not, rewrite this needs to be -Paul
    const nextState = (isHost) => {
        console.log("In nextState, current page " + currentPage);
        switch (currentPage) {
            case QuizPages.START:
                setCurrentPage(QuizPages.LOADING);
                break;
            case QuizPages.QUESTION:
                if (isHost) {
                    socket.emit('end_question', {Game_id: params.Game_id});
                    setCurrentPage(QuizPages.LEADERBOARD);
                } else {
                    setCurrentPage(QuizPages.POSTQUESTION);
                }
                break;
            case QuizPages.POSTQUESTION:
                if (isHost) {
                    socket.emit('end_question', {Game_id: params.Game_id});
                    if(isGameOver)
                        setCurrentPage(QuizPages.POSTGAME);
                    else
                        setCurrentPage(QuizPages.LEADERBOARD);
                }
                break;
            case QuizPages.LOADING:
                setCurrentPage(QuizPages.QUESTION);
                getNextQuestion();
                break;
            case QuizPages.LEADERBOARD:
                if (isGameOver) {
                    setCurrentPage(QuizPages.POSTGAME);
                } else {
                    getNextQuestion();
                    setCurrentPage(QuizPages.QUESTION);
                }
                break;
            case QuizPages.POSTGAME:
                setCurrentPage(QuizPages.POSTGAME);
                break;
            case QuizPages.ERROR:
                setCurrentPage(QuizPages.ERROR);
                break;
            default:
                setCurrentPage(QuizPages.ERROR);
                break;
        }
    }

    const onQuestionSubmit = (AnswerID) => {
        socket.emit("submit_answer", {Game_id: params.Game_id, Player_id: user, Answer_Status: currentQuestion.CheckAnswer(AnswerID)});
        setCurrentPage(QuizPages.POSTQUESTION);
    }

    const onTimerEnd = () => {
        console.log("Timer End");
        //socket.emit("submit_answer", {Game_id: params.Game_id, Player_id: user, Answer_Status: 0}); //This crashes the game!
        setCurrentPage(QuizPages.LEADERBOARD);
    }

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
                    onAdvance={nextState}
                    onTimerEnd={onTimerEnd}
                    onEndGame={isGameOver ? exitToDashboard : destroyGame}
                    endGameText={isGameOver ? "Exit" : "End Game"}
                    timerRef={timerRef}
                    numPlayerAnswers={numPlayerAnswers}
                />
            </header>
            <div>
                {currentPage === QuizPages.START && <StartPage/>}
                {currentPage === QuizPages.QUESTION && <QuestionPage
                    question={currentQuestion}
                    onAnswer={onQuestionSubmit}
                />}
                {currentPage === QuizPages.POSTQUESTION && <PostQuestionPage/>}
                {currentPage === QuizPages.LOADING && <LoadingPage/>}
                {currentPage === QuizPages.LEADERBOARD && <LeaderboardPage
                    lb={leaderboard.leaderboard}
                />}
                {currentPage === QuizPages.POSTGAME && <PostGamePage
                    leaderboard={leaderboard}
                />}
                {currentPage === QuizPages.ERROR &&
                    <h1>AN ERROR HAS OCCURRED AND THE DEVELOPER IS DRINKING PROFUSELY BECAUSE OF IT</h1>}
            </div>
        </div>
    );
}

export default HostGame;
