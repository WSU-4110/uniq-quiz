import {React, useState, useEffect} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router'
import ProfileBanner from '../../components/ProfileBanner.jsx';
import axios from 'axios';
import styles from "../../Stylesheets/Groups/GroupViewer.module.css";

export default function GroupViewer({asInset = false}){

    const {user, userName, loading} = useAuth();
    const navigate = useNavigate();

    const [myGroups, setMyGroups] = useState([]); //holds ongoingGames, decks, topUsers
    const [allGroups, setAllGroups] = useState([]); //holds ongoingGames, decks, topUsers
    const [viewMyGroups, setViewMyGroups] = useState(true);
    const [refresh, setRefresh] = useState(0);

    const getGroups = async() =>{
        try {
            const response = await axios.get("/api/groups/");
            setAllGroups(response.data);
            return response.data;
            //TODO: update groups with ongoingGames, decks, topUsers
        } catch (error) {
            console.error(error.message);
        }
    }

    const getMyGroups = async(allGroupData) =>{
        try{
            const response = await axios.get(`/api/groupMembership/member/${user}`);
            const dataGroups = response.data.map(group => group.Group_id);
            setMyGroups(allGroupData.filter(group => dataGroups.includes(group.Group_id)));
        } catch (error) {
            console.error(error.message);
        }
    }

    const createGroup = async() =>{
        try{
            const response = await axios.post("/api/groups/", {Group_Name: 'Untitled Group', Founder_id: user});
            setRefresh(prev => prev + 1);
        } catch (error) {
            console.error(error.message);
        }
    }

    const deleteGroup = async(Group_id) =>{
        try{
            const response = await axios.delete(`/api/groups/${Group_id}`);
            setRefresh(prev => prev + 1);
        } catch (error) {
            console.error(error.message);
        }
    }

    const leaveGroup = async(Group_id) =>{
        try{
            const response = await axios.delete('api/groupMembership/', { data: {Group_id: Group_id, User_id: user} });
            setRefresh(prev => prev + 1);
        } catch (error) {
            console.error(error.message);
        }
    }

    const viewGroup = (Group_id) =>{
        navigate(`/groups/${Group_id}`);
    }

    const joinGroup = async(Group_id) =>{
        try{
            const response = await axios.post("api/groupMembership", {Group_id: Group_id, User_id: user});
            setRefresh(prev => prev + 1);
        } catch (error){
            console.error(error.message);
        }
    }

    const fetchData = async() =>{
        const allGroupsData = await getGroups();
        await getMyGroups(allGroupsData);
    }

    //refresh listener
    useEffect(()=>{
        fetchData();
    }, [refresh])

    //component mount listener
    useEffect(()=>{
        fetchData();
    }, []);

    return(<>
        <div className={styles.page}>
        {!asInset && <ProfileBanner />}
            <div className={styles.menuContainer}>
                {asInset && <p>My Groups</p>}
                {!asInset && (
                    <div>
                        {viewMyGroups && <button onClick={createGroup}>Create Group</button>}
                        <button onClick={()=>{setViewMyGroups(!viewMyGroups)}}>{viewMyGroups ? 'Find Groups' : 'View My Groups'}</button>
                    </div>
                )}
            </div>
            <div className={asInset ? styles.groupContainerSmall : (viewMyGroups ? styles.groupContainer : styles.browseContainer)}>
                {viewMyGroups && (<>
                    {myGroups.sort((a,b) => a.Group_Name > b.Group_Name ? 1 : -1)
                        .map((group, index) => (
                            <div key={index} className={styles.groupItem}>
                                <Link to={`/groups/${group.Group_id}`}>
                                <div className={styles.groupItemHeader}>
                                    <h1>{group.Group_Name ? group.Group_Name : "Untitled Group"}</h1>
                                </div>
                                </Link>
                                <div className={styles.groupItemContent}>
                                    <div className={styles.buttonContent}>
                                        <p>Ongoing Games: {myGroups.ongoingGames ? myGroups.ongoingGames : "NONE"}</p>
                                        <p>Decks: {myGroups.decks ? myGroups.decks : "NONE"}</p>
                                        <p>Top Users: {myGroups.topUsers ? myGroups.topUsers : "NONE"}</p>
                                    </div>
                                    {!asInset && <button onClick={() => leaveGroup(group.Group_id)} className={styles.hoverButton}>Leave This Group</button>}
                                    {!asInset && group.Founder_id === user && <button onClick={() => deleteGroup(group.Group_id)} className={styles.hoverButton}>Delete Group</button>}
                                </div>
                            </div>
                    ))}
                </>)}
                {!viewMyGroups && (<>
                    {allGroups.sort((a,b) => a.Group_Name > b.Group_Name ? 1 : -1)
                        .map((group, index) => (
                            <div key={index} className={styles.browseItem}>
                                <div className={styles.browseInfo}>
                                    <h1>{group.Group_Name ? group.Group_Name : "Untitled Group"}</h1>
                                </div>
                                <div className={styles.browseMenu}>
                                    <button onClick={() => viewGroup(group.Group_id)}>View Group</button>
                                    <button onClick={() => joinGroup(group.Group_id)}>Join Group</button>
                                </div>
                            </div>
                    ))}
                </>)}
            </div>
        </div>
    </>);
}