import React, { useEffect, useState } from 'react';
import {Navigate, useLocation} from 'react-router';
import axios from 'axios'; // Ensure axios is installed
import Decks from '../pages/Decks/Decks.jsx';
import styles from '../Stylesheets/Components/ProfileBanner.module.css';

//Component Based Design Pattern. Uses different components to display different statistics for users to see.
function Profile(){
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();
    const [profilePicture, setProfilePicture] = useState(null);

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

    return (
        <div className={styles.profileBanner}>
            <div className={styles.userInfo}>
                <div className={styles.profilePicture}>
                    {profilePicture ? <img src={profilePicture} /> : 'Null Picture'}
                </div>
                <p className={styles.p}>{user ? user : 'Welcome'}</p>
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
                <h1><ul>Decks: </ul></h1>
                <Decks asInset={true}/>
            </div>
            <div className="App">
                <h1><ul>Groups: </ul></h1>
                {/* <Groups asInset={true}/> */}
            </div>
        </div>
        );
}

export default Profile;