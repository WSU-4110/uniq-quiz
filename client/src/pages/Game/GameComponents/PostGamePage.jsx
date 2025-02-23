import React from 'react';

function PostGamePage({ onAdvance }) {
    return (
        <div>
            <h1>PostGamePage</h1>
            <button onClick={onAdvance}>Next State</button>
        </div>
    )
}

export default PostGamePage;