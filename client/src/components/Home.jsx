import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is installed
import '../App.css.old';

function Home() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('sessionToken'); // Adjust based on how you store it
                if (!token) return; // No token means user is not logged in

                const response = await axios.get('/api/auth/', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(response.data);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError(err.message);
                setUser("TestUser001");
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="App">
            <h1>Home</h1>
            {user ? <h2>Welcome back, {user.name}!</h2> : <h2>Welcome</h2>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
    );
}

export default Home;
