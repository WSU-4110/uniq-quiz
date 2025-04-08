import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from 'axios';
import styles from '../../Stylesheets/Auth/Auth.module.css';

function Settings() {
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const { user } = useAuth();
    const [newUsername, setNewUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [showUsernameDropdown, setShowUsernameDropdown] = useState(false);
    const [showProfilePictureDropdown, setShowProfilePictureDropdown] = useState(false);
    const [showProfileStatusDropdown, setShowProfileStatusDropdown] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    
    function handleDelete() {
        axios.delete('/api/auth/deleteaccount', { withCredentials: true })
            .then(response => {
                alert('Your account has been deleted.');
                window.location.href = '/';
            })
            .catch(error => {
                console.error('Error deleting account:', error);
                alert(`Error: ${error.response?.data?.message || 'Failed to delete account'}`);
            });
    }

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
        

        const handleStatusChange = async () => {
            if (!userData) return;
        
            setIsUpdating(true);
            try {
                const newStatus = !userData.Private;
                
                // Try these endpoint variants if first fails:
                const endpoints = [
                    `/api/users/${user}/privacy`,
                    `/api/user/privacy`,
                    `/api/users/update-privacy`
                ];
        
                let lastError;
                
                for (const url of endpoints) {
                    try {
                        const response = await axios.put(
                            url,
                            { privacy: newStatus },
                            { withCredentials: true }
                        );
                        
                        setUserData(prev => ({ ...prev, Private: newStatus }));
                        return;
                        
                    } catch (err) {
                        lastError = err;
                        console.warn(`Attempt failed for ${url}`, err);
                    }
                }
                
                throw lastError;
        
            } catch (error) {
                console.error('All attempts failed:', error);
                alert(`Error: ${error.response?.data?.message || 'Update failed'}`);
            } finally {
                setIsUpdating(false);
            }
        };

        const handleUsernameUpdate = async (e) => {
            e.preventDefault();
            setUsernameError('');
            
            const trimmedUsername = newUsername.trim();
            
            // Frontend validation
            if (!trimmedUsername) {
                setUsernameError('Username cannot be empty');
                return;
            }
            
            if (trimmedUsername.length < 3) {
                setUsernameError('Username must be at least 3 characters');
                return;
            }
    
            setIsUpdating(true);
            try {
                const response = await axios.put(
                    `/api/users/${user}/username`,
                    { username: trimmedUsername },
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
    
                // Update local state
                setUserData(prev => ({
                    ...prev,
                    username: trimmedUsername
                }));
                
                setNewUsername('');
                alert('Username updated successfully!');
                
            } catch (error) {
                console.error('Update failed:', {
                    status: error.response?.status,
                    data: error.response?.data
                });
                
                setUsernameError(
                    error.response?.data?.message || 
                    'Failed to update username. Please try again.'
                );
            } finally {
                setIsUpdating(false);
            }
        };
    
        

    
    return (
        <div>
            <div className={styles.Settings}>
            <button onClick={toggleUsernameDropdown}> CHANGE USERNAME </button>
                {showUsernameDropdown && (
                    <div className={styles.InnerAuth}>
                        <form onSubmit={handleUsernameUpdate}>
                            <label> New Username:
                                <input type="text" value={newUsername} onChange={(e) => {
                                setNewUsername(e.target.value); 
                                if (usernameError) setUsernameError('');}}
                                minLength={3} maxLength={20} required/>
                            </label>
                    {usernameError && (<p className={styles.errorText}> {usernameError} </p>)}
                        <button 
                            type="submit" disabled={isUpdating || newUsername.trim().length < 3} >{isUpdating ? 'Updating...' : 'Update Username'}
                        </button>
                    </form>
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

            <button onClick={toggleProfileStatusDropdown}>CHANGE PROFILE STATUS</button>
                {showProfileStatusDropdown && (
                    <div className={styles.InnerAuth}>
                        <label htmlFor="profileStatus">Profile Status</label><br/>
                        <label>{userData?.Private ? 'Private' : 'Public'}</label><br/>
                        <button type="button" onClick={handleStatusChange} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 
                `Set to ${userData?.Private ? 'Public' : 'Private'}`
            }
                        </button>
                    </div>
                )}
            
                <button onClick={handleDelete}> <important> DELETE CURRENT USER ACCOUNT </important></button>
            </div>


        </div>
    );
}

export default Settings;
