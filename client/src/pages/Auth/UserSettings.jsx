import React from 'react';

function handleDelete() {
    fetch('/api/auth/deleteaccount', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                alert('Your account has been deleted.');
                window.location.href = '/';
            } else {
                return response.json().then(data => {
                    alert(`Error: ${data.message || 'Failed to delete account'}`);
                });
            }
        })
        .catch(error => {
            console.error('Error deleting account:', error);
            alert('An error occurred while deleting your account.');
        });
}

function UserSettings() {
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

export default UserSettings;
