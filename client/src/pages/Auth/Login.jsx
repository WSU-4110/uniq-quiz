import React from 'react';
import axios from 'axios';
import '../../Stylesheets/Auth/Auth.css'

function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            email,
            password,
        }

        try{
            const respone = await axios.post('/api/auth/login', payload);

            const data = respone.data;

            if (data.error) {
                setError(data.error || 'Something went wrong with the network.');
            }
        } catch (error) {
            console.log("Login() error: ", error);
            setError("Something went wrong with the network, the developers are crying fixing it.");
        }
    }

    const handleSubmit_OLD = async (e) => {
        e.preventDefault();

        setError(null);

        const payload = {
            email,
            password,
        };

        try{
            const respone = await fetch('/api/auth/login', {
                method: 'POST',
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })

            const data = await respone.json();

            if (data.error) {
                setError(data.error || 'Something went wrong');
            }
        }
        catch(err) {
            console.log("Login() error: " + err);
            setError("If you are seeing this message, the developer is crying.");
        }
    }
    return (

        <div className="Login">
            <div className="OutterAuth">
                <div className="AuthBlock">
                    <div className="InnerAuth">
                        <h2>Login</h2>
                        {error && <p style={{color: 'red'}}>{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email </label><br/>
                            <input type="text" id="email" name="email" placeholder="Email@example.com" value={email}
                                   onChange={(e) => setEmail(e.target.value)} required/><br/><br/>
                            <label htmlFor="password">Password </label><br/>
                            <input type="password" id="password" name="password" placeholder="••••••••" value={password}
                                   onChange={(e) => setPassword(e.target.value)} required/><br/><br/>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;