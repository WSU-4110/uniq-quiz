import React from 'react';

function Signup() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');
    const [displayName, setDisplayName] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Checks if passwords match
        if (password !== passwordConfirm) {
            setError("Passwords do not match");
            return;
        }
        setError(null);

        const payload = {
            email,
            password,
            displayName,
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
            <h2>Signup Page</h2>
            <p>Fill out the bellow form</p>
            {error && <p style={{ color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="text" id="email" name="email" placeholder="Email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /><br/>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br/>
                <label htmlFor="password_confirmation">Confirm Password</label>
                <input type="password" id="password_confirmation" name="password_confirmation" placeholder="Confirm Password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required /><br/>
                <label htmlFor="display_name">Display Name</label>
                <input type="text" id="display_name" name="display_name" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required /><br/>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Signup;