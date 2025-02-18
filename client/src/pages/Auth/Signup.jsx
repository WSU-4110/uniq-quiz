import React from 'react';
import axios from 'axios';
import '../../Stylesheets/Auth/Auth.css'

function Signup() {
    const [email, setEmail] = React.useState('');
    const [emailConfirm, setEmailConfirm] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');
    const [display_name, setDisplayName] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (email !== emailConfirm) {
            setError("Emails do not match");
            return;
        }
        else if (password !== passwordConfirm) {
            setError("Passwords do not match");
            return;
        }
        setError(null);

        const payload = {
            email,
            password,
            display_name,
        };

        try {
            const respone = await axios.post('/api/auth/signup', payload);

            const data = respone.data;
            if (data.error) {
                setError(data.error || 'Something went wrong with the network.');
            }
        } catch (error) {
            setError("Something went wrong with the network, the developers are crying fixing it.");
            console.log(error);
        }
    }

    const old_handleSubmit = async (e) => {
        e.preventDefault();

        if (email !== emailConfirm) {
            setError("Emails do not match");
            return;
        }

        //Checks if passwords match
        if (password !== passwordConfirm) {
            setError("Passwords do not match");
            return;
        }
        setError(null);

        const payload = {
            email,
            password,
            display_name,
        };

        try{
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error.message || 'Something went wrong');
                console.log(data.error);
            } else {
                const sessionToken = data.data.session && data.data.session.access_token;
                if (sessionToken) {
                    localStorage.setItem('sessionToken', sessionToken);
                    console.log('Signup (should be) successful and token (should be) stored'); //Line is for testing, delete later
                } else{
                    setError(null);
                    console.log('Session not returned')
                }
            }
        } catch (error) {
            console.log('Signup() error: ', error);
            setError("Something went wrong with the network, please try again later");
        }
    }

    return (
        <div className="Signup">
            <div className="OutterAuth">
                <div className="AuthBlock">
                    <div className="InnerAuth">
                        <h2>Signup</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email </label><br/>
                            <input type="text" id="email" name="email" placeholder="Email@example.com" value={email}
                                   onChange={(e) => setEmail(e.target.value)} required/><br/><br/>

                            <label htmlFor="emailConfirm">Confirm Email </label><br/>
                            <input type="text" id="email" name="email" placeholder="Email@example.com"
                                   value={emailConfirm}
                                   onChange={(e) => setEmailConfirm(e.target.value)} required/><br/><br/>

                            <label htmlFor="password">Password </label><br/>
                            <input type="password" id="password" name="password" placeholder="••••••••" value={password}
                                   onChange={(e) => setPassword(e.target.value)} required/><br/><br/>

                            <label htmlFor="passwordConfirm">Confirm Password </label><br/>
                            <input type="password" id="password" name="password" placeholder="••••••••"
                                   value={passwordConfirm}
                                   onChange={(e) => setPasswordConfirm(e.target.value)} required/><br/><br/>

                            <label htmlFor="displayname">Displayname </label><br/>
                            <input type="text" id="displayname" name="displayname" placeholder="User001" value={display_name}
                                   onChange={(e) => setDisplayName(e.target.value)} required/><br/><br/>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Signup;
