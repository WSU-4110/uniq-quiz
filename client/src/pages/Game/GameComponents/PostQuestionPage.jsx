import React from 'react';

function PostQuestionPage({ onAdvance }) {
    return (
        <div>
            <h1>PostQuestionPage</h1>
            <button onClick={onAdvance}>Next State</button>
        </div>
    )
}

export default PostQuestionPage;