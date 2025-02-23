import React from 'react';

function LeaderboardPage({ onAdvance }) {
    return (
        <div>
            <h1>LeaderboardPage</h1>
            <button onClick={onAdvance}>Next State</button>
        </div>
    )
}

export default LeaderboardPage;