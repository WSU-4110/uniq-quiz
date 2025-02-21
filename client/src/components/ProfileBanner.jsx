import {useState, useEffect} from 'react';
import axios from 'axios'; // Ensure axios is installed
import styles from '../Stylesheets/Components/ProfileBanner.module.css';

export default function ProfileBanner(){
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);

    /** @todo Migrate this code from Home to Profile Banner fully, delete code from Home */
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

    return(
        <div className={styles.profileBanner}>
            <div className={styles.userInfo}>
                <div className={styles.profilePicture}>
                    {profilePicture ? <img src={profilePicture} /> : 'Null Picture'}
                </div>
                <p className={styles.p}>{user ? {user} : 'Welcome'}</p>
            </div>
        </div>
    );
}