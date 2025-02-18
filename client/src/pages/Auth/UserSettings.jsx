import React from 'react';
import axios from 'axios';

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

function DeleteUserButton() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <button
                onClick={handleDelete}
                style={{
                    backgroundColor: 'red',
                    color: 'white',
                    fontSize: '20px',
                    padding: '15px 30px',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '5px'
                }}
            >
                DELETE CURRENT USER ACCOUNT
            </button>
        </div>
    );
}

export default DeleteUserButton;