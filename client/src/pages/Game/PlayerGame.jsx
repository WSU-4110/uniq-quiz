import React, { useState } from 'react';
import StartPage from './GameComponents/StartPage';
import QuestionPage from './GameComponents/QuestionPage';
import PostQuestionPage from './GameComponents/PostQuestionPage';
import LoadingPage from './GameComponents/LoadingPage';
import LeaderboardPage from './GameComponents/LeaderboardPage';
import PostGamePage from './GameComponents/PostGamePage';

const QuizPages = {
    START: "start",
    QUESTION: "question",
    POSTQUESTION: "postquestion",
    LOADING: "loading",
    LEADERBOARD: "leaderboard",
    POSTGAME: "postgame"
};

function PlayerGame() {
    const [currentPage, setCurrentPage] = useState(QuizPages.START);

    const renderPage = () => {
        switch (currentPage) {
            case QuizPages.START:
                return <StartPage onAdvance={() => setCurrentPage(QuizPages.QUESTION)} />;
            case QuizPages.QUESTION:
                return <QuestionPage onAdvance={() => setCurrentPage(QuizPages.LOADING)} />;
            case QuizPages.POSTQUESTION:
                return <PostQuestionPage onAdvance={() => setCurrentPage(QuizPages.POSTQUESTION)} />
            case QuizPages.LOADING:
                return <LoadingPage onAdvance={() => setCurrentPage(QuizPages.LEADERBOARD)} />
            case QuizPages.LEADERBOARD:
                return <LeaderboardPage onAdvance={() => setCurrentPage(QuizPages.QUESTION)} />
            case QuizPages.POSTGAME:
                return <PostGamePage />
            default:
                console.error("PlayerGame.jsx line 22, game failed to swap to valid state.")
                return null;
        }
    }

    return (
        <div>{renderPage()}</div>
    );
}

export default PlayerGame;