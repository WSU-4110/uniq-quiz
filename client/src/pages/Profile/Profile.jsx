import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Decks from '../Decks/Decks.jsx';
import GroupViewer from '../Groups/GroupViewer.jsx';
import axios from 'axios';
import styles from '../../Stylesheets/Profile.module.css';

function Profile(){
    const params = useParams();
    const location = useLocation();
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({});
    const [deckData, setDeckData] = useState({});
    const {user, userName} = useAuth();
    const [profilePicture, setProfilePicture] = useState(null);

    const getUser = async() =>{
        try {
            const response = await axios.get(`/api/users/${params.User_id}`);
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
            const response = await axios.get(`/api/decks/${params.User_id}/user_decks`);
            console.log(`deck data for ${params.User_id}`, response.data);
            setDeckData(response.data.filter(deck => deck.User_id === params.User_id));
        } catch (error) {
            console.error(error.message);
        }
    }
    useEffect(()=>{
        getMyDecks();
    }, [])
    useEffect(()=>{
        getMyDecks();
    }, [userData]) 

    return (
        <div className={styles.page}>
            <div className={styles.userInfo}>
                <div className={styles.profilePicture}>
                    {profilePicture ? <img src={profilePicture} /> : 'Null Picture'}
                </div>
                <p className={styles.p}>{userName ? userName : 'Welcome'}</p>
            </div>
            <div className={styles.pageHeader}>
                <h1>{userData.Username ? userData.Username : 'Unnamed User'}</h1>
            </div>
            {(user === userData.User_id || !userData.Private) && (<>
                <div className={styles.sectionHeader}>
                    <h1><ul>Stats: </ul></h1>
                </div>
                <div className={styles.sectionBody}>
                    <ul>
                        <li><h2>Top Wins: {userData.Wins}</h2></li>
                        <li><h2>Total Points: {userData.Total_Score}</h2></li>
                        <li><h2>Best Deck: {userData.Highest_Score_id ? userData.Highest_Score_id : "None"}
                            ; {userData.Highest_Score} </h2></li>
                        <li><h2>Decks Made: {deckData.length}</h2></li>
                    </ul>
                </div>
                <div className={styles.sectionHeader}>
                    <h1><ul><Link to="/decks" className={styles.links}>Decks: </Link></ul></h1>
                </div>
                <div className={styles.sectionBody}>
                    <Decks asInset={true} showOnlyDecks={true} viewUser={params.User_id}/>
                </div>
                <div className={styles.sectionHeader}>
                    <h1><ul><Link to="/groups" className={styles.links}>Groups: </Link></ul></h1>
                </div>
                <div className={styles.sectionBodyEnd}>
                    <GroupViewer asInset={true} viewUser={params.User_id}/>
                </div>
            </>)}   
            {(user !== userData.User_id && userData.Private) && (<div className={styles.privateUser}>
                <p>User profile is private</p>
            </div>)}
        </div>
        );
}

export default Profile;