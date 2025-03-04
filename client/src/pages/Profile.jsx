import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';
import axios from 'axios'; // Ensure axios is installed
import Decks from '../pages/Decks/Decks.jsx';
import styles from '../Stylesheets/Profile.module.css';

function Profile(){
    const {user, userName} = useAuth();
    const location = useLocation();
    const [profilePicture, setProfilePicture] = useState(null);

    return (
        <div className={styles.profileBanner}>
            <div className={styles.userInfo}>
                <div className={styles.profilePicture}>
                    {profilePicture ? <img src={profilePicture} /> : 'Null Picture'}
                </div>
                <p className={styles.p}>{userName ? userName : 'Welcome'}</p>
            </div>
            <div className="App">
                <h1><ul>Stats: </ul></h1>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                    <li><h2 style={{ display: 'inline' }}>Top Wins: 0</h2></li>
                    <li><h2 style={{ display: 'inline' }}>Total Points: 0</h2></li>
                    <li><h2 style={{ display: 'inline' }}>Best Deck: 0; 0</h2></li>
                    <li><h2 style={{ display: 'inline' }}>Decks Made: 0</h2></li>
                </ul>
            </div>
            <div className="App">
                <h1><ul><Link to="/decks" className={styles.links}>Decks: </Link></ul></h1>
                <Decks asInset={true} showOnlyDecks={true}/>
            </div>
            <div className="App">
                <h1><ul>Groups: </ul></h1>
                {/* <Groups asInset={true}/> */}
            </div>
        </div>
        );
}

export default Profile;