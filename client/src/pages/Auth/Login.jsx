import React from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import '../../Stylesheets/Auth/Auth.css'

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
            //TODO: Implement proper error handling, setError sets the error that is displayed to end user
            setError("A login error has occurred");
            console.log(error);
        } else if (success) {
            navigate("/dashboard");
        }
    };

    const handleSubmit_OLD = async (e) => {
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

    return (

        <div className="Login">
            <div className="OuterAuth">
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