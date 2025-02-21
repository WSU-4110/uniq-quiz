import React, { useEffect, useState } from 'react';
import {Navigate, useLocation} from 'react-router';
import axios from 'axios'; // Ensure axios is installed
import Decks from '../Decks/Decks.jsx';

function Home() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/auth/getdisplayname' , { withCredentials: true });
                setUser(response.data.display_name);
                console.log(response.data);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError(err.message);
            }
        };

        fetchUser();
    }, []);

    //set true to user for conditional redirect
    return true ? (
        <div className="App">
            <Decks asInset={true}/>
            <h1>Home</h1>
            {user ? <h2>Welcome back, {user}!</h2> : <h2>Welcome</h2>}
            <p style={{color: 'var(--feature)'}}>Todo: Add Groups inset here</p>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
        ) : (<Navigate to={"/login"} replace state={{ path: location.pathname }} />);
}

export default Home;
