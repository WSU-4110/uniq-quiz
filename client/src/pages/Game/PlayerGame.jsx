import React, { useState } from 'react';
import StartPage from './GameComponents/StartPage';
import QuestionPage from './GameComponents/QuestionPage';
import PostQuestionPage from './GameComponents/PostQuestionPage';
import LoadingPage from './GameComponents/LoadingPage';
import LeaderboardPage from './GameComponents/LeaderboardPage';
import PostGamePage from './GameComponents/PostGamePage';
import InfoBar from './GameComponents/InfoBar';


//HW4: State Machine Design Pattern
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
    const [currentPage, setCurrentPage] = useState(QuizPages.START);
    const nextState = (isHost, isGameOver, progressNextQuestion) => {
        console.log("In nextState, current page " + currentPage);
        switch (currentPage) {
            case QuizPages.START:
                setCurrentPage(QuizPages.LOADING);
                break;
            case QuizPages.QUESTION:
                if (isHost && progressNextQuestion) {
                setCurrentPage(QuizPages.LEADERBOARD);
                } else {
                    setCurrentPage(QuizPages.POSTQUESTION);
                }
                break;
            case QuizPages.POSTQUESTION:
                if (isHost && progressNextQuestion) {
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

    const renderPage = () => {
        switch (currentPage) {
            case QuizPages.START:
                return <StartPage onAdvance={nextState} />;
            case QuizPages.QUESTION:
                return <QuestionPage onAdvance={nextState} />;
            case QuizPages.POSTQUESTION:
                return <PostQuestionPage onAdvance={nextState} />
            case QuizPages.LOADING:
                return <LoadingPage onAdvance={nextState} />
            case QuizPages.LEADERBOARD:
                return <LeaderboardPage onAdvance={nextState} />
            case QuizPages.POSTGAME:
                return <PostGamePage />
            case QuizPages.ERROR:
                console.error(currentPage + "Error PlayerGame.jsx");
                return(<h1>AN ERROR HAS OCCURRED AND THE DEVELOPER IS DRINKING PROFUSELY BECAUSE OF IT</h1>)
            default:
                console.error("PlayerGame.jsx line 22, game failed to swap to valid state.")
                break;
        }
    }

    return (
        <div>
            <header>
                <InfoBar
                    gameCode={"J8B3"}
                    deckName={"What The Fucking Shit"}
                    displayName={"PaulM"}
                    score={45300}
                    isHost={true}
                    onAdvance={nextState}
                />
            </header>
            <div>
                {renderPage()}
            </div>
        </div>
    );
}

export default PlayerGame;