import {React, useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
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
    const navigate = useNavigate();

    const [group, setGroup] = useState({});
    const [isInGroup, setIsInGroup] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [members, setMembers] = useState([]);
    const [decks, setDecks] = useState([]);
    const [activeGames, setActiveGames] = useState([]);
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
        console.log("Transferring ownershp to:", User_id);
        try{
            let New_Founder;
            if(User_id) New_Founder = User_id;
            else{
                const validIds = members.filter(member => member.User_id !== user);
                const randomIndex = Math.floor(Math.random() * validIds.length);
                New_Founder = validIds[randomIndex];
            }
            console.log("New founder:", New_Founder);
            const response = await axios.put(`/api/groups/${params.Group_id}`, {Founder_id: New_Founder.User_id});
        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchData = () => {
        const groupData = getGroup();
        const memberData = getMembers();
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
                <h1>{group.Group_Name}</h1>
                <div>
                    <button onClick={isInGroup ? leaveGroup : joinGroup} className={styles.menuButton}>{isInGroup ? "Leave Group" : "Join Group"}</button>
                    {isOwner && <button onClick={deleteGroup} className={styles.menuButton}>Delete Group</button>}
                </div>
            </div>
            <div className={styles.groupHeaders}>
                <h3>Active Games</h3>
            </div>
            <div className={styles.groupContainerSmall}>
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
            <div className={styles.groupContainerSmall}>

            </div>
            <div className={styles.groupHeaders}>
                <h3>Leaderboards</h3>
            </div>
            <div className={styles.groupContainer}>
                <div className={styles.leaderDiv}>
                    {}
                </div>
                <div className={styles.leaderDiv}>
                    {members.map(member => 
                        <div className={styles.leaderboardItem}>
                            <h2>{member.Username}</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}