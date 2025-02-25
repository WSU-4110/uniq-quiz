import {useAuth} from '../../context/AuthContext.jsx';
import styles from '../../Stylesheets/Game/Join.module.css'

export default function Join({socket, joinCode, setJoinCode}){
    const {user, userName} = useAuth();

    //Controller function for Join
    function joinGame(e){
        e.preventDefault(); //form automatically reloads page
        if(joinCode){
            socket.emit('join_lobby', { Join_Code: joinCode, User_id: user, Username: userName });
            setJoinCode(joinCode);
        }
    }

    return(
        <form onSubmit={joinGame}>
            <label htmlFor="Join Code">Join Code </label><br/>
            <input type="text" id="join_code" name="join code" value={joinCode} placeholder=""
                    onChange={(e) => setJoinCode(e.target.value)} required/>
            <button className={styles.menuButton} type="submit">Go</button>
        </form>

    );
}