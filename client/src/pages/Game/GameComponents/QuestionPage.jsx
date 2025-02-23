import React from 'react';

function QuestionPage({ onAdvance }) {
    return (
        <div>
            <h1>Question</h1>
            <button onClick={onAdvance}>Next State</button>
        </div>
    )
}

export default QuestionPage;