import React, { useEffect, useState } from 'react';
import {Navigate, useLocation} from 'react-router';
import {useAuth} from '../../context/AuthContext.jsx';
import Decks from '../Decks/Decks.jsx';

function Home() {
    const {user, userName} = useAuth();
    const [error, setError] = useState(null);
    const location = useLocation();

    return true ? (
        <div className="App">
            <Decks asInset={true}/>
            <h1>Home</h1>
            {userName ? <h2>Welcome back, {userName}!</h2> : <h2>Welcome</h2>}
            <p style={{color: 'var(--feature)'}}>Todo: Add Groups inset here</p>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
        ) : (<Navigate to={"/login"} replace state={{ path: location.pathname }} />);
}

export default Home;