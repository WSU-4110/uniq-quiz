import React, {useEffect, useRef, useState} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import { useParams } from 'react-router-dom';
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
import { Question } from './GameLogic';


const QuizPages = {
    START: "start",
    QUESTION: "question",
    POSTQUESTION: "postquestion",
    LOADING: "loading",
    LEADERBOARD: "leaderboard",
    POSTGAME: "postgame",
    ERROR: "error"
};

function PlayerGame() {
    const initQuestion = new Question(
        "Default Question",
        "Default Answer 1",
        "Default Answer 2",
        "Default Answer 3",
        "Default Answer 4",
        2
    )

    const params = useParams();
    const socket = useSocket();
    const {user, userName, loading} = useAuth();
    const [currentPage, setCurrentPage] = useState(QuizPages.START);
    const [card, setCard] = useState({});
    const [isHost, setIsHost] = useState(params ? true : false);
    const [joinCode, setJoinCode] = useState("");
    const [isGameOver, setIsGameOver] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState( initQuestion);
    const timerRef = useRef(null);
    let playerScore = 0

    const getJoinCode = async() => {
        console.log(params);
        if(params.Game_id){
            try {
                const response = await fetch(`http://localhost:3000/api/games/${params.Game_id}/game`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const jsonData = await response.json();
                console.log(jsonData);
                setJoinCode(jsonData.Join_Code);
            } catch (error) {
                console.error(error.message);
            }
        }
    }

    const getLiveDeck = async() => {

    }

    const getNextQuestion = async() => {
        if(params){
            console.log("sending game ID", params.Game_id);
            socket.emit('send_next_card', {Game_id: params.Game_id});
        }
    }

    //socket listener
    useEffect(() => {
        socket.on('card_for_client', (data) => {
            setCard(data.Card);
            if(!data.Card){
                socket.emit('end_game', {Game_id: params.Game_id});
                console.log(`Destroying game ${params.Game_id ? params.Game_id : 'no game'}`);
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

        return () => {
            delete window.changeQuizState;
        };
    }, []);

    //This is the logic for the host to change between different states
    const nextState = (isHost) => {
        console.log("In nextState, current page " + currentPage);
        switch (currentPage) {
            case QuizPages.START:
                setCurrentPage(QuizPages.LOADING);
                break;
            case QuizPages.QUESTION:
                if (isHost) {
                setCurrentPage(QuizPages.LEADERBOARD);
                } else {
                    setCurrentPage(QuizPages.POSTQUESTION);
                }
                break;
            case QuizPages.POSTQUESTION:
                if (isHost) {
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
        playerScore += currentQuestion.CheckAnswer(AnswerID, 1, 1);
        console.log(currentQuestion.CheckAnswer(AnswerID, 1, 1));
        console.log(playerScore);
        console.log("Answer: ", AnswerID);
        setCurrentPage(QuizPages.POSTQUESTION);
    }

    const onTimerEnd = () => {
        playerScore += currentQuestion.CheckAnswer(9, 1, 1);
        console.log("Timer End");
        setCurrentPage(QuizPages.LEADERBOARD);
    }

    return (
        <div style={{ overflowY: 'hidden' }}>

            <header>
                <InfoBar
                    gameCode={joinCode}
                    deckName={"Unknown Deck Title"}
                    displayName={userName}
                    score={playerScore}
                    isHost={isHost}
                    onAdvance={nextState}
                    onTimerEnd={onTimerEnd}
                    timerRef={timerRef}
                />
            </header>
            <div>
                {currentPage === QuizPages.START && <StartPage/>}
                {currentPage === QuizPages.QUESTION && <QuestionPage
                    Question={currentQuestion}
                    onAnswer={onQuestionSubmit}
                />}
                {currentPage === QuizPages.POSTQUESTION && <PostQuestionPage/>}
                {currentPage === QuizPages.LOADING && <LoadingPage/>}
                {currentPage === QuizPages.LEADERBOARD && <LeaderboardPage
                    first={"First Place"}
                    second={"Second Place"}
                    third={"Third Place"}
                    fourth={"Fourth Place"}
                    fifth={"Fifth Place"}
                />}
                {currentPage === QuizPages.POSTGAME && <PostGamePage
                    first={"First Place Name"}
                    second={"Second Place Name"}
                    third={"Third Place Name"}
                    others={["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"]}
                />}
                {currentPage === QuizPages.ERROR &&
                    <h1>AN ERROR HAS OCCURRED AND THE DEVELOPER IS DRINKING PROFUSELY BECAUSE OF IT</h1>}
            </div>
        </div>
    );
}

export default PlayerGame;