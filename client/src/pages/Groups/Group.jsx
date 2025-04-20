import {React, useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import TabButton from '../../components/TabButton.jsx';
import ProfileBanner from '../../components/ProfileBanner.jsx';
import AddDeckModal from './AddDeckModal.jsx';
import styles from "../../Stylesheets/Groups/Group.module.css";
import Decks from "../Decks/Decks.jsx"
import {useAuth} from '../../context/AuthContext.jsx';

export default function Group()
{
    const {user, userName, loading} = useAuth();
    const params = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState({});
    const [isInGroup, setIsInGroup] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [members, setMembers] = useState([]);
    const [topMembers, setTopMembers] = useState([]);
    const [decks, setDecks] = useState([]);
    const [myDecks, setMyDecks] = useState([]);
    const [activeGames, setActiveGames] = useState([]);
    const [editTitle, setEditTitle] = useState(false);
    const [groupTitle, setGroupTitle] = useState("");
    const [viewAddDeck, setViewAddDeck] = useState(false);
    const [refresh, setRefresh] = useState(0);

    const getMembers = async() => {
        try {
            const response = await axios.get(`api/groupMembership/group/${params.Group_id}`);
            const memberData = getMemberUsers(response.data.map(member => member.User_id));
            return memberData;
        }
        catch (error) {
            console.error(error.message);
        }
    }

    const getMemberUsers = async(memberData) => {
        if(memberData.includes(user)){
            setIsInGroup(true);
        }
        try{
            const response = await axios.post("api/users/list", { User_Ids: memberData });
            setMembers(response.data);
            setTopMembers(response.data.sort((a,b) => a.Total_Score/a.Games_Played < b.Total_Score/b.Games_Played ? 1 : -1).slice(0,3));
            return response.data;
        } catch (error) {
            console.error(error.message);
        }
    }

    const getGroup = async() => {
        try {
            const response = await axios.get(`/api/groups/${params.Group_id}`);
            setGroup(response.data);
            if(response.data.Founder_id === user) setIsOwner(true);
            setGroupTitle(response.data.Group_Name);
            return response.data;
        }
        catch (error) {
            console.error(error.message);
        }
    }

    const leaveGroup = async() => {
        if(isOwner && members.length <= 1) deleteGroup();
        else if(isOwner && members.length > 1) transferOwnership();
        try{
            const response = await axios.delete('api/groupMembership/', { data: {Group_id: params.Group_id, User_id: user} });
            setRefresh(prev => prev + 1);
            setIsInGroup(false);
            setIsOwner(false);
        } catch (error) {
            console.error(error.message);
        }
    }

    const joinGroup = async() => {
        try{
            const response = await axios.post("api/groupMembership", {Group_id: params.Group_id, User_id: user});
            setRefresh(prev => prev + 1);
            setIsInGroup(true);
        } catch (error){
            console.error(error.message);
        }
    }

    const deleteGroup = async() => {
        try{
            const response = await axios.delete(`/api/groups/${params.Group_id}`);
            setRefresh(prev => prev + 1);
        } catch (error) {
            console.error(error.message);
        }
        navigate('/groups');
    }

    const transferOwnership = async(User_id) =>{
        try{
            let New_Founder;
            if(User_id) New_Founder = User_id;
            else{
                const validIds = members.filter(member => member.User_id !== user);
                const randomIndex = Math.floor(Math.random() * validIds.length);
                New_Founder = validIds[randomIndex];
            }
            const response = await axios.put(`/api/groups/${params.Group_id}`, {Founder_id: New_Founder.User_id});
        } catch (error) {
            console.error(error.message);
        }
    }

    const renameGroup = async() => {
        setEditTitle(!editTitle);
        if (editTitle) {
            try{
                const response = await axios.put(`/api/groups/${params.Group_id}`, {Group_Name: groupTitle});
            } catch (error) {
                console.error(error.message);
            }
        }
    }

    const handleChangeTitle = (e) => {
        setGroupTitle(e.target.value);
    }

    const getDecks = async() =>{
        try{
            const response = await axios.get("/api/decks/");
            const validDecks = response.data.filter(deck => deck.deck_id !== null);
            setDecks(validDecks.filter(deck => deck.group_id == params.Group_id));

            const response_user = await axios.get(`/api/decks/${user}/user_decks`);
            const validUserDecks = response_user.data.filter(deck => deck.deck_id !== null);
            
            const response_liked = await axios.get(`/api/userLikedDecks/${user}`);

            const comboDecks = validUserDecks.concat(response_liked.data);
            setMyDecks(comboDecks);
        } catch (error) {
            console.error(error.message);
        }
    }

    const addDeck = async(deck) =>{
        console.log("add deck called");
        if(!decks.includes(deck)){
            console.log("not in decks,", deck);
            try{
                const response = await axios.put(`/api/decks/${deck.deck_id}`, {Group_id: params.Group_id});
                getDecks();
            }catch (error){
                console.error(error.message);
            }
        }else{
            console.log("it actually has", deck);
        }
    }

    const removeDeck = async(deck)=>{
        try{
            const response = await axios.put(`/api/decks/${deck.deck_id}`, {Group_id: null});
            getDecks();
        }catch (error){
            console.error(error.message);
        }
    }

    const kickUser = async(User_id)=>{
        try{
            const response = await axios.delete('api/groupMembership/', { data: {Group_id: params.Group_id, User_id: User_id} });
            setRefresh(prev => prev + 1);
        }catch (error){
            console.error(error.message);
        }
    }

    const fetchData = () => {
        getGroup();
        getMembers();
        getDecks();
    }

    //refresh listener
    useEffect(()=>{
        fetchData();
    }, [refresh]);

    //component mount listener
    useEffect(()=>{
        fetchData();
    }, []);

    return(
        <div class={styles.page}>
            <ProfileBanner/>
            <div className={styles.pageHeader}>
                {!editTitle && <h1>{groupTitle}</h1>}
                {editTitle && <input className={styles.input} type="text" required value={groupTitle} onChange={handleChangeTitle}></input>}
                <div>
                    {isOwner &&<button onClick={renameGroup} className={styles.menuButton}>{editTitle ? "Save" : "Rename Group"}</button>}
                    <button onClick={isInGroup ? leaveGroup : joinGroup} className={styles.menuButton}>{isInGroup ? "Leave Group" : "Join Group"}</button>
                    {isOwner && <button onClick={deleteGroup} className={styles.menuButton}>Delete Group</button>}
                </div>
            </div>
            <div className={styles.groupHeaders}>
                <h3>Leaderboards</h3>
            </div>
            <div className={styles.groupContainer}>
                <div className={styles.leaderDiv}>
                    <h3>Top Members</h3>
                    {topMembers.map((member, key) => 
                        <div key={key} className={styles.leaderboardItem}>
                            <Link to={`/profile/${member.User_id}`} className={styles.links}>
                                <h2>{key+1} {member.Username}</h2>
                            </Link>
                            <p>Average Score: {(member.Total_Score / member.Games_Played).toFixed(2)}</p>
                        </div>
                    )}
                </div>
                <div className={styles.leaderDiv}>
                    <h3>All Members</h3>
                    {members.map(member => 
                        <div className={styles.leaderboardItem}>
                            <Link to={`/profile/${member.User_id}`} className={styles.links}><h2>{member.Username}</h2></Link>
                            {isOwner && member.User_id !== user && <button onClick={()=>{kickUser(member.User_id)}} className={styles.kickUserButton}><h4>Kick User</h4></button>}
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.groupHeaders}>
                <h3>Decks</h3>
                <div>
                    {viewAddDeck && (<AddDeckModal decks={myDecks} onSelect={addDeck} onClose={() => setViewAddDeck(false)}/>)}
                    <button onClick={()=>{setViewAddDeck(!viewAddDeck)}} className={styles.menuButton}>Add Deck</button>
                </div>
            </div>
            <div className={styles.groupContainerSmall}>
                {decks.length === 0 && <p>No decks in group</p>}
                {decks.length !== 0 && (<>
                    {decks.sort((a,b) => a.Title > b.Title ? 1 : -1)
                    .map((deck, index) => (
                        <div key={index} className={styles.deckItem}>
                            <div className={styles.deckItemHeader}>
                                <h1>{deck.title ? deck.title : "Untitled Deck"}</h1>
                                <p>Author: {deck.username}</p>
                                <button onClick={() => removeDeck(deck)} className={styles.hoverButton}>Remove from Group</button>
                            </div>
                        </div>
                    ))}
                </>)}
            </div>
        </div>
    )
}