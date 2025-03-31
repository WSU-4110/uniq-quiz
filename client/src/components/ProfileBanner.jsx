import {useState, useEffect} from 'react';
import axios from 'axios'; // Ensure axios is installed
import {useAuth} from '../context/AuthContext';
import styles from '../Stylesheets/Components/ProfileBanner.module.css';

export default function ProfileBanner(){
    const [error, setError] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const {userName} = useAuth();

    return(
        <div className={styles.profileBanner}>
            <div className={styles.userInfo}>
                <div className={styles.profilePicture}>
                    {profilePicture ? <img src={profilePicture} /> : 'Null Picture'}
                </div>
                <p className={styles.p}>{userName ? userName : 'Welcome'}</p>
            </div>
        </div>
    );
}