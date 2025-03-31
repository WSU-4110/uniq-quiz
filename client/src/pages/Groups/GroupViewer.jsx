import {React, useState, useEffect} from 'react';
import {useAuth} from '../../context/AuthContext.jsx';
import ProfileBanner from '../../components/ProfileBanner.jsx';
import axios from 'axios';
import styles from "../../Stylesheets/Groups/GroupViewer.module.css";

export default function GroupViewer({asInset = false}){

    const {user, userName, loading} = useAuth();
    const [groups, setGroups] = useState([]); //holds ongoingGames, decks, topUsers
    const [viewMyGroups, setViewMyGroups] = useState(true);
    const [refresh, setRefresh] = useState(0);

    const getGroups = async() =>{
        try {
            const response = await axios.get("/api/groups/");
            setGroups(response.data); //TODO: once we can join groups, filter accordingly. .filter(group => group.User_id === user)

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

    //refresh listener
    useEffect(()=>{
        getGroups();
    }, [refresh])

    //component mount listener
    useEffect(()=>{
        getGroups();
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
            <div className={asInset ? styles.groupContainerSmall : styles.groupContainer}>
                {viewMyGroups && (<>
                    {groups.sort((a,b) => a.Group_Name > b.Group_Name ? 1 : -1)
                        .map((group, index) => (
                            <div key={index} className={styles.groupItem}>
                                <div className={styles.groupItemHeader}>
                                    <h1>{group.Group_Name ? group.Group_Name : "Untitled Group"}</h1>
                                </div>
                                <div className={styles.groupItemContent}>
                                    <div className={styles.buttonContent}>
                                        <p>Ongoing Games: {groups.ongoingGames ? groups.ongoingGames : "NONE"}</p>
                                        <p>Decks: {groups.decks ? groups.decks : "NONE"}</p>
                                        <p>Top Users: {groups.topUsers ? groups.topUsers : "NONE"}</p>
                                    </div>
                                    {!asInset && <button onClick={() => leaveGroup(group.Group_id)} className={styles.hoverButton}>Leave This Group</button>}
                                    {!asInset && group.Founder_id === user && <button onClick={() => deleteGroup(group.Group_id)} className={styles.hoverButton}>Delete Group</button>}
                                </div>
                            </div>
                    ))}
                </>)}
                {!viewMyGroups && (<>
                    <p>Browse groups here</p>
                </>)}
            </div>
        </div>
    </>);
}