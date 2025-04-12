import {useState, useEffect} from 'react';
import axios from 'axios'; // Ensure axios is installed
import {useAuth} from '../context/AuthContext';
import styles from '../Stylesheets/Components/ProfileBanner.module.css';

export default function ProfileBanner(){
    const [error, setError] = useState(null);
    const {userName, user, updateUser} = useAuth();
    const [userData, setUserData] = useState(null);

    const getUser = async() => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${user}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            setUserData(jsonData);
        } catch (error) {
            console.error(error.message);
            setError(error.message);
        }
    }
    
    useEffect(() => {
        getUser();
    }, []);

    return(
        <div className={styles.profileBanner}>
            <div className={styles.userInfo}>
              <img src={userData?.Profile_Pic} alt={`${userName}'s profile`} style={{ 
                width: "100px", 
                height: "auto"}}/>
            <p className={styles.p}>{userName ? userName : 'Welcome'}</p>
            </div>
        </div>
    );
}