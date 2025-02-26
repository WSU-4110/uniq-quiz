import {React, useState, useEffect} from 'react';
import TabButton from '../../components/TabButton.jsx';
import ListItem from '../../components/ListItem.jsx';
import ProfileBanner from '../../components/ProfileBanner.jsx';
import { Link, } from 'react-router'
import styles from "../../Stylesheets/Groups/GroupsPage.css";

export default function Groups({asInset = false})
{
    const [members, setMembers] = useState([]);
    const [decks, setDecks] = useState([]);
    const [activeGames, setActiveGames] = useState([]);

    const getMembers = async() => {
        try {
            const response = await fetch("http://localhost:3000/api/groupMembership");
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

    return(
        <div className={styles.page}>
            <ProfileBanner/>
            <TabButton>
                <div className={styles.deckItem}>
                    {members.map((member) => (
                        <h1>w</h1>
                    ))}
                </div>
            </TabButton>
        </div>
    )
}