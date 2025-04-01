import {React, useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import TabButton from '../../components/TabButton.jsx';
import ProfileBanner from '../../components/ProfileBanner.jsx';
import styles from "../../Stylesheets/Groups/Group.module.css";
import Decks from "../Decks/Decks.jsx"
import {useAuth} from '../../context/AuthContext.jsx';

export default function Group()
{
    const {user, userName, loading} = useAuth();
    const params = useParams();

    const [group, setGroup] = useState({});
    const [isInGroup, setIsInGroup] = useState(false);
    const [members, setMembers] = useState([]);
    const [decks, setDecks] = useState([]);
    const [activeGames, setActiveGames] = useState([]);

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
            return response.data;
        } catch (error) {
            console.error(error.message);
        }
    }

    const getDecks = async() => {
        try {
            const response = await fetch("/api/decks/");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            setDecks(jsonData);
        }
        catch (error) {
            console.error(error.message);
        }
    }

    const getGames = async() => {
        try {
            const response = await fetch("/api/games/");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            setDecks(jsonData);
        }
        catch (error) {
            console.error(error.message);
        }
    }

    const getGroup = async() => {
        try {
            const response = await axios.get(`/api/groups/${params.Group_id}`);
            setGroup(response.data);
            return response.data;
        }
        catch (error) {
            console.error(error.message);
        }
    }

    const fetchData = () => {
        const groupData = getGroup();
        const memberData = getMembers();
        getGames();
        getDecks();
    }

    useEffect(()=>{
        fetchData();
    }, []);

    return(
        <div class={styles.page}>
            <ProfileBanner/>
            <div className={styles.groupHeaders}>
                <h1>{group.Group_Name}</h1>
                <p>{isInGroup ? "Leave Group" : "Join Group"}</p>
            </div>
            <div className={styles.groupHeaders}>
                <h3>Active Games</h3>
            </div>
            <div className = {styles.groupContainer}>
            {activeGames.map((games) => (
                        <TabButton>
                            <div className={styles.groupItem}>
                                <h1>PlaceHolderGameName</h1>
                                <p></p>
                            </div>
                        </TabButton>
                    ))}
            </div>
            <div className={styles.groupHeaders}>
                <h3>Decks</h3>
            </div>
            <div className = {styles.groupContainer}>

            </div>
            <div className={styles.groupHeaders}>
                <h3>Leaderboards</h3>
            </div>
            <div className = {styles.groupContainer}>
                {members.map(member => 
                    <div className={styles.leaderboardItem}>
                        <h2>{member.Username}</h2>
                    </div>
                )}
            </div>
        </div>
    )
}