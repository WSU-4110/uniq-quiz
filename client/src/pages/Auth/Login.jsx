import React from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import styles from '../../Stylesheets/Auth/Auth.module.css';

function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const { success, error } = await login(email, password);
        if (error) {
            setError(error);
        } else if (success) {
            navigate("/dashboard");
        }
    };

    const handleSubmit_OLD2 = async (e) => {
        e.preventDefault();
        setError(null);

        const payload = {
            email,
            password,
        }

        try{
            const response = await axios.post('/api/auth/login', payload);

            const data = response.data;

            if (data.error) {
                setError(data.error || 'Something went wrong with the network.');
            }else{
                login();
                navigate('/dashboard');
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

        <div className={styles.Login}>
            <div className={styles.OuterAuth}>
                <div className={styles.AuthBlock}>
                    <div className={styles.InnerAuth}>
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