import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from 'axios';
import ProfileBanner from '../../components/ProfileBanner.jsx';
import styles from '../../Stylesheets/Auth/Auth.module.css';

function Settings() {
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({});
    const {user, userName} = useAuth();
    const [display_name, setDisplayName] = React.useState('');
    const [showUsernameDropdown, setShowUsernameDropdown] = useState(false);
    const [showProfilePictureDropdown, setShowProfilePictureDropdown] = useState(false);
    const [showProfileStatusDropdown, setShowProfileStatusDropdown] = useState(false);
    
    function handleDelete() {
        axios.delete('/api/auth/deleteaccount', { withCredentials: true })
            .then(response => {
                alert('Your account has been deleted.');
                window.location.href = '/'; // Redirect to home or login page
            })
            .catch(error => {
                console.error('Error deleting account:', error);
                alert(`Error: ${error.response?.data?.message || 'Failed to delete account'}`);
            });
    }

    const getUser = async() =>{
        try {
            const response = await fetch(`http://localhost:3000/api/users/${user}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            const jsonData = await response.json();
            setUserData(jsonData);
            console.log(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    }
    useEffect(()=>{
            getUser();
        }, [])

        const toggleUsernameDropdown = () => {
            setShowUsernameDropdown(!showUsernameDropdown);
            setShowProfilePictureDropdown(false);
            setShowProfileStatusDropdown(false);
        };
    
        const toggleProfilePictureDropdown = () => {
            setShowProfilePictureDropdown(!showProfilePictureDropdown);
            setShowUsernameDropdown(false);
            setShowProfileStatusDropdown(false);
        };
    
        const toggleProfileStatusDropdown = () => {
            setShowProfileStatusDropdown(!showProfileStatusDropdown);
            setShowUsernameDropdown(false);
            setShowProfilePictureDropdown(false);
        };


    return (
        <div>
            <ProfileBanner/>
            <div className={styles.Settings}>
            <button onClick={toggleUsernameDropdown}> CHANGE USERNAME </button>
            {showUsernameDropdown && (
                <div className={styles.InnerAuth}>
                    <label htmlFor="displayname">New Displayname </label><br/>
                    <input type="text" id="displayname" name="displayname" placeholder="User001" value={display_name}
                            onChange={(e) => setDisplayName(e.target.value)} required/><br/><br/>
                    <button type="submit">Submit</button>
                </div>
            )}

            <button onClick={toggleProfilePictureDropdown}> CHANGE PROFILE PICTURE </button>
            {showProfilePictureDropdown && (
                <div className={styles.InnerAuth}>
                    <label htmlFor="profilepicture">Insert Profile Picture </label><br/>
                    <button type="insert">Insert</button>
                    <button type="submit">Submit</button>
                </div>
            )}

            <button onClick={toggleProfileStatusDropdown}> CHANGE PROFILE STATUS </button>
            {showProfileStatusDropdown && (
                <div className={styles.InnerAuth}>
                    <label htmlFor="profileStatus">Profile Status </label><br/>
                    <label2>{userData.Private ? 'Private' : 'Public'}</label2><br/>
                    <button type="button" onClick={() => { userData.Private = !userData.Private;}}> Change </button>
                </div>
            )}
            
                <button onClick={handleDelete}> <important> DELETE CURRENT USER ACCOUNT </important></button>
            </div>


        </div>
    );
}

export default Settings;
