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
    const leaderboard = new Leaderboard();

    const params = useParams();
    const socket = useSocket();
    const navigate = useNavigate();
    const {user, userName, loading} = useAuth();
    const [currentPage, setCurrentPage] = useState(QuizPages.START);
    const [card, setCard] = useState({});
    const [deckTitle, setDeckTitle] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState( initQuestion);
    const timerRef = useRef(null);
    const [playerScore, setPlayerScore] = useState(0);
    const [isHost, setIsHost] = useState(true); //Ensure this is set to false in PlayerGame.jsx and true in HostGame.jsx

    const getJoinCode = async() => {
        console.log(params);
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

    const getNextQuestion = async() => {
        if(params){
            console.log("sending game ID", params.Game_id);
            socket.emit('send_next_card', {Game_id: params.Game_id});
        }
    }

    /**@todo this is a duplicate with host, please unpair */
    const destroyGame = () => {
        socket.emit('end_game', {Game_id: params.Game_id});
        console.log(`Destroying game ${params.Game_id ? params.Game_id : 'no game'}`);
    }

    const exitToDashboard = () => {
        navigate("/dashboard");
    }

    //socket listener
    useEffect(() => {
        socket.on('card_for_client', (data) => {
            setCard(data.Card);
            console.log(data);
            console.log(card);

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
            console.log("Question end", data.Scores);
            data.Scores.map((player) => {
                leaderboard.updatePlayer(player.User_id, player.Player_score);
                console.log("Updating player", player);
            })
        })

        socket.on('answer_submitted', (data) => {
            if(data.AllSubmitted){
                nextState(true);
            }else{
                /**@TODO have screen display how many players have answered */
            }
        })

        socket.on('deck_title', (data) => {
            if(data){
                setDeckTitle(data.Title);
            }
        })

        socket.on('game_ended', (data)=>{
            setIsGameOver(true);
        });
    }, []);

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
        console.log(currentQuestion.CheckAnswer(AnswerID, 0, 1));
        console.log(playerScore);
        console.log("Answer: ", AnswerID);
        socket.emit("submit_answer", {Game_id: params.Game_id, Player_id: user, Answer_Status: currentQuestion.CheckAnswer(AnswerID)});
        setCurrentPage(QuizPages.POSTQUESTION);
    }

    const onTimerEnd = () => {
        setPlayerScore(playerScore + currentQuestion.CheckAnswer(9, 0, 1));
        console.log("Timer End");
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
                    leaderboard={leaderboard}
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
