import React, {useEffect, useState} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import { useParams } from 'react-router-dom';

//pages
import StartPage from './GameComponents/StartPage';
import QuestionPage from './GameComponents/QuestionPage';
import PostQuestionPage from './GameComponents/PostQuestionPage';
import LoadingPage from './GameComponents/LoadingPage';
import LeaderboardPage from './GameComponents/LeaderboardPage';
import PostGamePage from './GameComponents/PostGamePage';
import InfoBar from './GameComponents/InfoBar';


const QuizPages = {
    START: "start",
    QUESTION: "question",
    POSTQUESTION: "postquestion",
    LOADING: "loading",
    LEADERBOARD: "leaderboard",
    POSTGAME: "postgame",
    ERROR: "error"
};

function CalcPlyaerScore(isQuestionCorrect, position, totalPos){
    const positionReversed = totalPos - position;
    var normalizedPosition = positionReversed / totalPos;
    normalizedPosition = Math.abs(normalizedPosition);

    var correctScore = (1000 * normalizedPosition) + 1000;
    var positionScore = normalizedPosition * 100;
    return ( Math.ceil(isQuestionCorrect ? correctScore : positionScore));
}

function PlayerGame() {
    const params = useParams();
    const {user, userName, loading} = useAuth();
    const [currentPage, setCurrentPage] = useState(QuizPages.START);
    const [isHost, setIsHost] = useState(params ? true : false);
    const [joinCode, setJoinCode] = useState("");

    const getJoinCode = async() => {
        console.log(params);
        if(params.game_id){
            try {
                const response = await fetch(`http://localhost:3000/api/games/${params.game_id}/game`);
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
    const nextState = (isHost, isGameOver) => {
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
                break;
            case QuizPages.LEADERBOARD:
                if (isGameOver) {
                    setCurrentPage(QuizPages.POSTGAME);
                } else {
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

    return (
        <div style={{ overflowY: 'hidden' }}>

            <header>
                <InfoBar
                    gameCode={joinCode}
                    deckName={"Unknown Deck Title"}
                    displayName={userName}
                    score={45300}
                    isHost={isHost}
                    onAdvance={nextState}
                />
            </header>
            <div>
                { currentPage === QuizPages.START && <StartPage /> }
                { currentPage === QuizPages.QUESTION && <QuestionPage
                    Question={'What is the output to the python function "print(0.1 + 0.2)"?'}
                    Answer1={"3"}
                    Answer2={"0.3"}
                    Answer3={"3.3"}
                    Answer4={"3.000000000004"}
                    onAdvance={nextState}
                /> }
                { currentPage === QuizPages.POSTQUESTION && <PostQuestionPage /> }
                { currentPage === QuizPages.LOADING && <LoadingPage /> }
                { currentPage === QuizPages.LEADERBOARD && <LeaderboardPage
                    first={"First Place"}
                    second={"Second Place"}
                    third={"Third Place"}
                    fourth={"Fourth Place"}
                    fifth={"Fifth Place"}
                /> }
                { currentPage === QuizPages.POSTGAME && <PostGamePage
                    first={"First Place Name"}
                    second={"Second Place Name"}
                    third={"Third Place Name"}
                    others={["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"]}
                /> }
                {currentPage === QuizPages.ERROR && <h1>AN ERROR HAS OCCURRED AND THE DEVELOPER IS DRINKING PROFUSELY BECAUSE OF IT</h1> }
            </div>
        </div>
    );
}

export default PlayerGame;