import {React, useState, useEffect} from 'react';
import TabButton from '../../components/TabButton.jsx';
import ProfileBanner from '../../components/ProfileBanner.jsx';
import styles from "../../Stylesheets/Groups/Groups.module.css";
import Decks from "../Decks/Decks.jsx"

export default function Groups()
{
    const [members, setMembers] = useState([]);
    const [decks, setDecks] = useState([]);
    const [activeGames, setActiveGames] = useState([]);
    const [groups, setGroups] = useState([]);


    const getGroupMembership = async() => {
        try {
            const response = await fetch("/api/groupMembership/");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            setMembers(jsonData);
            console.log("Groups, ", jsonData);
        }
        catch (error) {
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
            const response = await fetch("/api/groups/");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            setGroups(jsonData);
            console.log("Groups, ", jsonData);
        }
        catch (error) {
            console.error(error.message);
        }
    }

    useEffect(()=>{
            getGroup();
        }, []);

    useEffect(()=>{
            getGames();
        }, []);
     
    useEffect(()=>{
            getDecks();
        }, []);

    useEffect(()=>{
            getGroupMembership();
        }, []);

    return(
        <div class={styles.page}>
            <ProfileBanner/>
            
            <div className={styles.groupHeaders}>
                {groups.map((group) => (
                        <h2>{group.Group_Name}</h2>
                    ))}
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
            <Decks asInset={true} showOnlyDecks={true}/>
            <div className={styles.groupHeaders}>
                <h3>Leaderboards</h3>
            </div>
            <div className = {styles.groupContainer}>

            </div>
        </div>
    )
}