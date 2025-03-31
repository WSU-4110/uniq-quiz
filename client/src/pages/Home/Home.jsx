import React, { useEffect, useState } from 'react';
import {Navigate, useLocation} from 'react-router';
import {useAuth} from '../../context/AuthContext.jsx';
import Decks from '../Decks/Decks.jsx';
import GroupViewer from '../Groups/GroupViewer.jsx';

function Home() {
    const {user, userName} = useAuth();
    const [error, setError] = useState(null);
    const location = useLocation();

    return true ? (
        <div className="App">
            <Decks asInset={true}/>
            <GroupViewer asInset={true}/>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
        ) : (<Navigate to={"/login"} replace state={{ path: location.pathname }} />);
}

export default Home;