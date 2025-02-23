import React from 'react';

function StartPage({ onAdvance }) {

    return (
        <div>
            <h1>Start</h1>
            <button onClick={onAdvance}>Next State</button>
        </div>
    )
}

export default StartPage;