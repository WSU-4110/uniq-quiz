import {React, useState, useEffect} from 'react';
import { Link } from 'react-router'
import axios from 'axios';
import styles from "../../Stylesheets/Groups/GroupPreview.module.css";

export default function GroupPreview(){
    const [groups, setGroups] = useState([]);
    const [ongoingGames, setOngoingGames] = useState(null);
    const [decks, setDecks] = useState(null);
    const [topUsers, setTopUsers] = useState(null);

    const getGroups = async() =>{
        try {
            const response = await axios.get("/api/groups/");
            setGroups(response.data); //TODO: once we can join groups, filter accordingly. .filter(group => group.User_id === user)
        } catch (error) {
            console.error(error.message);
        }
    }

    //component mount listener
    useEffect(()=>{
        getGroups();
    }, []);

    return(
        <div className={styles.page}>
            <div className={styles.menuContainer}>
                <p>My Groups</p>
            </div>
            <div className={styles.groupContainer}>
                {groups.sort((a,b) => a.Group_Name > b.Group_Name ? 1 : -1)
                    .map((group, index) => (
                        <div key={index} className={styles.groupItem}>
                            <div className={styles.groupItemHeader}>
                                <h1>{group.Group_Name ? group.Group_Name : "Untitled Group"}</h1>
                            </div>
                            <div className={styles.groupItemContent}>
                                <p>Ongoing Games: {ongoingGames ? ongoingGames : "NONE"}</p>
                                <p>Decks: {decks ? decks : "NONE"}</p>
                                <p>Top Users: {topUsers ? topUsers : "NONE"}</p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}