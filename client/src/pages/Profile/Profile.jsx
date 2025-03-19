import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Decks from '../Decks/Decks.jsx';
import axios from 'axios';
import styles from '../../Stylesheets/Profile.module.css';

function Profile(){
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({});
    const [deckData, setDeckData] = useState({});
    const {user, userName} = useAuth();
    const location = useLocation();
    const [profilePicture, setProfilePicture] = useState(null);

    const getUser = async() =>{
        try {
            const response = await axios.get(`/api/users/${user}`);
            setUserData(response.data);
        } catch (error) {
            console.error(error.message);
        }
    }
    
    useEffect(()=>{
        getUser();
    }, [])

    const getMyDecks = async() =>{
        try {
            const response = await fetch(`/api/decks/`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            const jsonData = await response.json();
            setDeckData(jsonData.filter(deck => deck.User_id === user));
        } catch (error) {
            console.error(error.message);
        }
    }
    useEffect(()=>{
            getMyDecks();
        }, [])

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
                    <li><h2 style={{ display: 'inline' }}>Top Wins: {userData.Wins}</h2></li>
                    <li><h2 style={{ display: 'inline' }}>Total Points: {userData.Total_Score}</h2></li>
                    <li><h2 style={{ display: 'inline' }}>Best Deck: {userData.Highest_Score_id ? userData.Highest_Score_id : "None"}
                         ; {userData.Highest_Score} </h2></li>
                    <li><h2 style={{ display: 'inline' }}>Decks Made: {deckData.length}</h2></li>
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