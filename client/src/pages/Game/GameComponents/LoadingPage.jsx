import React from 'react';

function LoadingPage({ onAdvance }) {
    return (
        <div>
            <h1>LoadingPage</h1>
            <button onClick={onAdvance}>Next State</button>
        </div>
    )
}

export default LoadingPage;