import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from 'axios';
import styles from '../../Stylesheets/Auth/Auth.module.css';

function Settings() {
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const {user, updateUser} = useAuth();
    
    const [newUsername, setNewUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    
    const [isUpdating, setIsUpdating] = useState(false);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    
    const [showUsernameDropdown, setShowUsernameDropdown] = useState(false);
    const [showProfilePictureDropdown, setShowProfilePictureDropdown] = useState(false);
    const [showProfileStatusDropdown, setShowProfileStatusDropdown] = useState(false);

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
                    { Username: trimmedUsername },
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                window.location.reload();
    
                // Update local state
                setUserData(prev => ({
                    ...prev,
                    Username: trimmedUsername
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

        const handleFileChange = (e) => {
            const selected = e.target.files[0];
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        
            if (!selected) return;
            if (!validTypes.includes(selected.type)) {
              return setMessage('Only JPG, JPEG, and PNG files are allowed.');
            }
            if (selected.size > 2 * 1024 * 1024) {
              return setMessage('File size must be under 2MB.');
            }
        
            setFile(selected);
            setMessage('');
          };        

          const uploadProfilePic = async () => {
            if (!file) return;
        
            const formData = new FormData();
            formData.append('file', file);
            formData.append('id', userData?.User_id);
        
            try {
              const response = await axios.post(`/api/users/${user}/profile-pic`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
        
              if (response.status === 200) {
                setMessage('Upload successful!');
              } else {
                setMessage('Upload failed.');
              }
            } catch (err) {
              console.error('Axios upload error:', err);
              setMessage('Upload failed.');
            }
          };

          return (
            <div>
              <div className={styles.Settings}>
                {/* Username Change Section */}
                <button onClick={toggleUsernameDropdown}>CHANGE USERNAME</button>
                {showUsernameDropdown && (
                  <div className={styles.InnerAuth}>
                    <form onSubmit={handleUsernameUpdate}>
                      <label>New Username:
                        <input 
                          type="text" 
                          value={newUsername} 
                          onChange={(e) => {
                            setNewUsername(e.target.value); 
                            if (usernameError) setUsernameError('');
                          }}
                          minLength={3} 
                          maxLength={20} 
                          required
                        />
                      </label>
                      {usernameError && <p className={styles.errorText}>{usernameError}</p>}
                      <button 
                        type="submit" 
                        disabled={isUpdating || newUsername.trim().length < 3}
                      >
                        {isUpdating ? 'Updating...' : 'Update Username'}
                      </button>
                    </form>
                  </div>
                )}
          
                {/* Profile Picture Section */}
                <button onClick={toggleProfilePictureDropdown}>CHANGE PROFILE PICTURE</button>
      {showProfilePictureDropdown && (
        <div className={styles.InnerAuth}>
                 Upload Profile Picture
                 <input
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileChange}
      />
      <button onClick={uploadProfilePic}>Upload</button>
    </div>
      )}
                {/* Profile Status Section */}
                <button onClick={toggleProfileStatusDropdown}>CHANGE PROFILE STATUS</button>
                {showProfileStatusDropdown && (
                  <div className={styles.InnerAuth}>
                    <label htmlFor="profileStatus">Profile Status</label><br/>
                    <label>{userData?.Private ? 'Private' : 'Public'}</label><br/>
                    <button 
                      type="button" 
                      onClick={handleStatusChange} 
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : `Set to ${userData?.Private ? 'Public' : 'Private'}`}
                    </button>
                  </div>
                )}
          
                {/* Delete Account Section */}
                <button onClick={handleDelete}>
                  DELETE CURRENT USER ACCOUNT
                </button>
              </div>
            </div>
          );
        }

export default Settings;
