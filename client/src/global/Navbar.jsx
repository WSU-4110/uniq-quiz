import {Link} from 'react-router';
import {React, useState} from 'react';
import {styled} from 'styled-components';
import StyledButton from './StyledButton';

const ProfilePic = styled.img`
        float: right;
        object-fit: cover;
        width:40px;
        height:40px;`

const topnav = styled.div`
        background-color: darkblue;
        display: flex;
        width: 100vw;
        overflow: hidden;
}
`

const burger = styled.button`
    @media screen and (max-width: 600px) {
        float: right;
        display: flex;
    }
`

export default function Navbar({isLoggedIn = false}){
    const [loginState, setLogin] = useState(isLoggedIn)
    const [responseState, setResponsive] = useState(false)

    return(
        <topnav variable={responseState}>
            <navMenu>
                <Link to="/"><StyledButton>Home</StyledButton></Link>
                <Link to="../pages/Decks/Decks.jsx"><StyledButton> Decks</StyledButton></Link>
                <Link to="/"><StyledButton>Host Game</StyledButton></Link>
                <Link to="/"><StyledButton>Join Game</StyledButton></Link>
                <Link to="/signup"><StyledButton>{isLoggedIn ? 'Log Out' : 'Log In/Sign Up'}</StyledButton></Link>
            </navMenu>
        </topnav>
    );
}