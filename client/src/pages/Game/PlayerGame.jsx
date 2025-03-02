import React, {useEffect, useState} from 'react';
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

    //This useEffect arrow function exists to allow the game to
    //change states via the console, e.g. setCurrentPage("loading")
    useEffect(() => {
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
    const nextState = (isHost, isGameOver, progressNextQuestion) => {
        console.log("In nextState, current page " + currentPage);
        switch (currentPage) {
            case QuizPages.START:
                setCurrentPage(QuizPages.LOADING);
                break;
            case QuizPages.QUESTION:
                if (false) {
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
        <div style={{ overflowY: 'hidden' }}>

            <header>
                <InfoBar
                    gameCode={"J8B3"}
                    deckName={"What The Fucking Shit"}
                    displayName={"PaulM"}
                    score={45300}
                    isHost={false}
                    onAdvance={nextState}
                />
            </header>
            <div>
                { currentPage === QuizPages.START && <StartPage onAdvance={nextState} /> }
                { currentPage === QuizPages.QUESTION && <QuestionPage
                    Question={'What is the output to the python function "print(0.1 + 0.2)"?'}
                    Answer1={"3"}
                    Answer2={"0.3"}
                    Answer3={"3.3"}
                    Answer4={"3.000000000004"}
                /> }
                { currentPage === QuizPages.POSTQUESTION && <PostQuestionPage onAdvance={nextState} /> }
                { currentPage === QuizPages.LOADING && <LoadingPage /> }
                { currentPage === QuizPages.LEADERBOARD && <LeaderboardPage
                    first={"First Place"}
                    second={"Second Place"}
                    third={"Third Place"}
                    fourth={"Fourth Place"}
                    fifth={"Fifth Place"}
                /> }
                { currentPage === QuizPages.POSTGAME && <PostGamePage onAdvance={nextState} /> }
                {currentPage === QuizPages.ERROR && <h1>AN ERROR HAS OCCURRED AND THE DEVELOPER IS DRINKING PROFUSELY BECAUSE OF IT</h1> }
            </div>
        </div>
    );
}

export default PlayerGame;