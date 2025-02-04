import {Link} from 'react-router';

export default function Navbar(){
    return(
        <div className='navbar'>
            <Link to="/">Home</Link>
            <Link to="../pages/Decks.jsx">Decks</Link>
        </div>
    );
}