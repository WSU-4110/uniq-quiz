import React from 'react';
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