import {Link} from 'react-router';
import {React, useState} from 'react';
import {styled} from 'styled-components';
import StyledButton from './StyledButton';

const ProfilePic = styled.img`
        float: right;
        object-fit: cover;
        width:40px;
        height:40px;
`;

const topnav = styled.div`
    background-color: darkblue;
    display: flex;
    width: 100vw;
    overflow: hidden;
`;

const burger = styled.button`
    @media screen and (max-width: 600px) {
        float: right;
        display: flex;
    }
`;

export default function Navbar({isLoggedIn = false}){
    const [loginState, setLogin] = useState(isLoggedIn)
    const [responseState, setResponsive] = useState(false)

    return(
        <topnav variable={responseState}>
            <navMenu>
                <Link to="/"><StyledButton>Home</StyledButton></Link>
                <Link to="/decks"><StyledButton> Decks</StyledButton></Link>
                <Link to="/host"><StyledButton>Host Game</StyledButton></Link>
                <Link to="/join"><StyledButton>Join Game</StyledButton></Link>
                <Link to="/settings"><StyledButton>Settings</StyledButton></Link>
                <Link to="/login"><StyledButton>Login</StyledButton></Link>
                <Link to="/signup"><StyledButton>Signup</StyledButton></Link>
                <Link to="/profile"><StyledButton>Profile</StyledButton></Link>
                <Link to="/api/auth/signout"><StyledButton>Logout</StyledButton></Link>
            </navMenu>
        </topnav>
    );
}