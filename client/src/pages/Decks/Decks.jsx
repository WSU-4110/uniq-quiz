import {React, useState, useEffect} from 'react';
import TabButton from '../../components/TabButton.jsx';
import ListItem from '../../components/ListItem.jsx';
import ProfileBanner from '../../components/ProfileBanner.jsx';
import { Link, } from 'react-router'
import {useAuth} from '../../context/AuthContext.jsx';
import axios from 'axios';
import styles from "../../Stylesheets/Decks/Decks.module.css";


export default function Decks({asInset = false, showOnlyDecks = false, viewUser = null}){
    const [tabChoice, setTabChoice] = useState(1);
    const [decks, setDecks] = useState([]);
    const [likedDecks, setLikedDecks] = useState([]);
    const [cards, setCards] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState({});
    const [viewDeck, setViewDeck] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterType, setFilterType] = useState("A-Z");
    const {user, userName, loading} = useAuth();
    const [selectedUser, setSelectedUser] = useState(viewUser ? viewUser : user);
    let tab='My Decks';

    if(tabChoice === 1){ tab = 'My Decks' }
    else if(tabChoice === 2){ tab = 'Community Decks' }
    else if(tabChoice === 3){ tab = 'Group Decks' }
    else if(tabChoice === 4){ tab = 'Saved Decks' }

    const getDecks = async() =>{
        try {
            const response = await axios.get("/api/decks");
            setDecks(response.data.filter(deck => deck.deck_id !== null));
        } catch (error) {
            console.error(error.message);   
        }
    }

    const getMyDecks = async() =>{
        try {
            const response = await axios.get(`/api/decks/${selectedUser}/user_decks`);
            setDecks(response.data.filter(deck => deck.deck_id !== null));
            const response2 = await axios.get(`/api/userLikedDecks/${selectedUser}`);
            const likedDecks = response2.data.map(deck => deck.deck_id);
            setLikedDecks(likedDecks);
        } catch (error) {
            console.error(error.message);
        }
    }

    const getOtherDecks = async() =>{
        try {
            const response = await axios.get(`/api/decks/${selectedUser}/other_decks`);
            setDecks(response.data.filter(deck => deck.deck_id !== null));
        } catch (error) {
            console.error(error.message);
        }
    }

    const getLikedDecks = async() =>{
        try{
            const response = await axios.get(`/api/userLikedDecks/${selectedUser}`);
            setDecks(response.data);
            console.log("liked decks:", response.data);
        }catch (error) {
            console.error(error.message);
        }
    }

    const createDeck = async() => {
        try{
            const response = await axios.post("/api/decks", { Title: "Untitled Deck", User_id: selectedUser});
            setRefresh(prev => prev + 1);
        } catch (error){
            console.error(error.message);
        }
    }
    
    const updateDeck = async() =>{
        if(selectedDeck && selectedDeck.deck_id){
            try{
                const response = await axios.put(`api/decks/${selectedDeck.deck_id}`, {Title: selectedDeck.title});
            }catch(error){
              console.error(error.message);
            }
        }else if(selectedDeck){
            try{
                const response = await axios.put(`api/decks/${selectedDeck.Deck_id}`, {Title: selectedDeck.title});
            }catch(error){
              console.error(error.message);
            }
        }

    }

    const getCards = async () =>{
        if (!selectedDeck.deck_id && !selectedDeck.Deck_id) {
            console.warn("No deck selected, skipping card fetch.");
            return;
        }
        if(selectedDeck.deck_id){
            try{
                const response = await axios.get(`/api/cards/${selectedDeck.deck_id}`);
                setCards(response.data);
            } catch (error){
              console.error(error.message);  
            }
        }else{
            try{
                const response = await axios.get(`/api/cards/${selectedDeck.Deck_id}`);
                setCards(response.data);
            } catch (error){
              console.error(error.message);  
            }
        }
    }

    const createCard = async() => {
        if(selectedDeck.deck_id){
            try{
                const response = await axios.post(`/api/cards/${selectedDeck.deck_id}`, 
                    {   Deck_id: selectedDeck.deck_id, 
                        Question: "", 
                        Answer: "", 
                        Incorrect1: "", 
                        Incorrect2: "", 
                        Incorrect3: ""
                    });
                setRefresh(prev => prev + 1);
            } catch (error){
                console.error(error.message);
            }
        }else{
            try{
                const response = await axios.post(`/api/cards/${selectedDeck.Deck_id}`, 
                    {   Deck_id: selectedDeck.Deck_id, 
                        Question: "", 
                        Answer: "", 
                        Incorrect1: "", 
                        Incorrect2: "", 
                        Incorrect3: ""
                    });
                setRefresh(prev => prev + 1);
            } catch (error){
                console.error(error.message);
            }
        }
    }

    const deleteDeck = async () => {
        if(selectedDeck.deck_id){
            try {
                await axios.delete(`api/decks/${selectedDeck.deck_id}`);
                setRefresh(prev => prev + 1);
            } catch (error) {
                console.error(error.message);
            }
        }else{
            try {
                await axios.delete(`api/decks/${selectedDeck.Deck_id}`);
                setRefresh(prev => prev + 1);
            } catch (error) {
                console.error(error.message);
            }
        }
    }

    function handleSelectDeck(deck){
        setSelectedDeck(deck);
        setViewDeck(true);
    }

    function handleUpdateDeck(property, newProperty){
        setSelectedDeck(prevDeck => ({
          ...prevDeck,
          [property]: newProperty
        }));
    }

    const toggleLikeDeck = async (deckId) => {
        try {
          if (likedDecks.includes(deckId)) {
            // If already liked, remove from likedDecks
            await axios.delete(`/api/userLikedDecks/${deckId}`);
            setLikedDecks(prevLikedDecks => prevLikedDecks.filter(id => id !== deckId)); // Remove deckId
          } else {
            // If not liked, add to likedDecks
            await axios.post(`/api/userLikedDecks/${deckId}`);
            setLikedDecks(prevLikedDecks => [...prevLikedDecks, deckId]); // Add deckId
          }
        } catch (error) {
          console.error(error.message);
        }
      }

    function handleDelete(){
        deleteDeck();
        setViewDeck(false);
    }

    useEffect(()=>{
        getMyDecks();
    }, [refresh, selectedDeck]);

    useEffect(() => {
        if (selectedDeck.deck_id || selectedDeck.Deck_id) {
            getCards();
        }
    }, [refresh, selectedDeck]);

    useEffect(()=>{
        if (Object.keys(decks).length > 0) {
          updateDeck();
        } 
    }, [selectedDeck])
    

    return (
    <div className={styles.page}>
        {!showOnlyDecks && <ProfileBanner />}
        {!showOnlyDecks && (
            <div className={styles.deckInterfaceContainer}>
                <div className={styles.deckTabs}>
                    <menu className={styles.deckMenu}>
                        <div className={styles.leftButtons}>
                            {!viewDeck && (<>
                                <TabButton className={styles.menuButton} onClick={createDeck}>Add Deck</TabButton>
                            </>)}
                            {viewDeck && (<>
                                <TabButton className={styles.menuButton} onClick={()=>{setViewDeck(!viewDeck)}}>Back</TabButton>
                                <TabButton className={styles.menuButton} onClick={createCard}>Add Card</TabButton>
                                <TabButton className={styles.menuButton} onClick={handleDelete}>Delete This Deck</TabButton>
                            </>)}
                        </div>
                        <div className={styles.rightButtons}>
                            <TabButton className={styles.menuButton} onClick={() => setFilterOpen(!filterOpen)}>Filter</TabButton>
                            <div style={{ position: "absolute" }}>
                                {filterOpen && (
                                    <div className={styles.filterDropdown}>
                                        <TabButton className={styles.menuButton} onClick={() => { setFilterType("A-Z"); setFilterOpen(false); }}>A-Z</TabButton>
                                        <TabButton className={styles.menuButton} onClick={() => { setFilterType("Z-A"); setFilterOpen(false); }}>Z-A</TabButton>
                                    </div>
                                )}
                            </div>
                            <TabButton className={styles.menuButton} onClick={() => {getLikedDecks();}}>Liked Decks</TabButton>
                            <TabButton className={styles.menuButton} onClick={() => {getMyDecks();}}>My Decks</TabButton>
                            <TabButton className={styles.menuButton} onClick={() => {getOtherDecks();}}>Find Decks</TabButton>
                        </div>
                    </menu>
                </div>
                {viewDeck && (
                    <div className={styles.cardHead}>
                        {selectedDeck && (
                            <ListItem content={selectedDeck.title ? selectedDeck.title : "Untitled Deck"} contentType="title" onChangeData={handleUpdateDeck}/>  
                        )}       
                    </div>
                )}
            </div>
        )}
        <div className={asInset ? styles.deckContainerSmall : styles.deckContainer}>
            {!viewDeck && (<>
                <div className={styles.emptyDecks}>{decks ? null : <p>Looks like you have no decks!</p>}</div>
                {decks
                    .sort((a, b) => {
                        const titleA = a.title || ''; // Default to empty string if Title is undefined
                        const titleB = b.title || ''; // Default to empty string if Title is undefined
                
                        if (filterType === "A-Z") return titleA.localeCompare(titleB);
                        if (filterType === "Z-A") return titleB.localeCompare(titleA);
                        return 0;
                })
                .map((deck, index) => (
                    <TabButton onClick={()=>{handleSelectDeck(deck)}}>
                        <div key={index} className={styles.deckItem}>
                            <h1>{deck.title ? deck.title : "Untitled Deck"}</h1>
                            <p><Link to={`/profile/${deck.user_id}`} className={styles.links}>{deck.username}</Link></p>
                        </div>
                        <TabButton 
                            className={styles.menuButton}
                            onClick={(e)=> {e.stopPropagation(); toggleLikeDeck(deck.deck_id);}}
                            >{likedDecks.includes(deck.deck_id) ? 'Unlike Deck' : 'Like Deck'}
                        </TabButton>
                    </TabButton>
                ))}
            </>)}
            {viewDeck && (<>
                {cards.sort((a,b) => a.Card_id > b.Card_id ? 1 : -1)
                .map((card) => (
                    <Link to={`/cards/${card.Card_id}`}>
                        <div key={card.Card_id} className={styles.deckItem}>
                            <h2>{card.Question ? card.Question : "Blank Card"}</h2>
                            <p>{card.Answer ? card.Answer : "Blank Answer"}</p>
                            id: {card.Card_id}
                        </div>
                    </Link>
                    ))}
            </>)}
        </div>
    </div>
);
}