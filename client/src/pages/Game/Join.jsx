import {useState} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import styles from '../../Stylesheets/Game/Join.module.css'

export default function Join({socket, lobbyState}){
    const {user, userName} = useAuth();

    //Controller function for Join
    function joinGame(e){
        e.preventDefault(); //form automatically reloads page
        if(lobbyState.state.joinCode){
            socket.emit('join_lobby', { Join_Code: lobbyState.state.joinCode, User_id: user, Username: userName });
        }
    }

    return(
        <form onSubmit={joinGame}>
            <label htmlFor="Join Code">Join Code </label><br/>
            <input type="text" id="join_code" name="join_code" value={lobbyState.state.joinCode ?? ""} placeholder=""
                    onChange={(e) => lobbyState.setState({...lobbyState.state, joinCode: e.target.value})} required/>
            <button className={styles.menuButton} type="submit">Go</button>
        </form>

    );
}