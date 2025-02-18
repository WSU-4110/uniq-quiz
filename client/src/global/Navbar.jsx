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
                <Link to="/api/auth/signout"><StyledButton>Logout</StyledButton></Link>
            </navMenu>
        </topnav>
    );
}

export default function Navbar({isLoggedIn = false}){
    const [loginState, setLogin] = useState(isLoggedIn)
    const [responseState, setResponsive] = useState(false)

    return(
        <topnav variable={responseState}>
            {isLoggedIn && (
                <myComponent/>
            )}
            {!isLoggedIn && (
                <otherComponent/>
            )}
            <navMenu>
            <nav className="navi">
            <ul className="navi_list">
                <li className="navi_listItem">
                    <Link to="/">Home</Link></li>

                <li className="navi_listItem">
                    <Link to="../pages/Decks.jsx"> Decks</Link></li>
                    
                <li className="navi_listItem">
                    Join/Host Games
                    <ul className="navi_listDrop">
                        <li><Link to="/">Host Game</Link></li>
                        <li><Link to="/">Join Game</Link></li>
                    </ul>
                </li>

            <li className="navi_listProfile">
                <div className="box"></div>
                <ul className="navi_listDropProfile">
                    <li><Link to="/signup">{isLoggedIn ? 'Log Out' : 'Log In/Sign Up'}</Link></li>
                </ul>
                </li>
                </ul>
                </nav>
            </navMenu>
        </topnav>
    );
}