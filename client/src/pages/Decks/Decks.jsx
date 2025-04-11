import {React, useState, useEffect} from 'react';
import TabButton from '../../components/TabButton.jsx';
import ListItem from '../../components/ListItem.jsx';
import ProfileBanner from '../../components/ProfileBanner.jsx';
import { Link, } from 'react-router'
import {useAuth} from '../../context/AuthContext.jsx';
import axios from 'axios';
import styles from "../../Stylesheets/Decks/Decks.module.css";


export default function Decks({asInset = false, showOnlyDecks = false}){
    const [tabChoice, setTabChoice] = useState(1);
    const [decks, setDecks] = useState([]);
    const [cards, setCards] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState({});
    const [viewDeck, setViewDeck] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const {user, userName, loading} = useAuth();

    let tab='My Decks';

    if(tabChoice === 1){ tab = 'My Decks' }
    else if(tabChoice === 2){ tab = 'Community Decks' }
    else if(tabChoice === 3){ tab = 'Group Decks' }
    else if(tabChoice === 4){ tab = 'Saved Decks' }

    const getDecks = async() =>{
        try {
            const response = await axios.get("/api/decks/authors");
            setDecks(response.data.filter(deck => deck.deck_id !== null));
        } catch (error) {
            console.error(error.message);   
        }
    }

    const createDeck = async() => {
        try{
            const response = await axios.post("/api/decks", { Title: "Untitled Deck", User_id: user});
            setRefresh(prev => prev + 1);
        } catch (error){
            console.error(error.message);
        }
    }
    
    const updateDeck = async() =>{
        if(selectedDeck && selectedDeck.deck_id){
            try{
                const response = await axios.put(`api/decks/${selectedDeck.deck_id}`, {Title: selectedDeck.Title});
            }catch(error){
              console.error(error.message);
            }
        }else if(selectedDeck){
            try{
                const response = await axios.put(`api/decks/${selectedDeck.Deck_id}`, {Title: selectedDeck.Title});
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
                console.log(selectedDeck.Deck_id);
                const response = await axios.get(`/api/cards/${selectedDeck.Deck_id}`);
                setCards(response.data);
                console.log(response.data);
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

    function handleDelete(){
        deleteDeck();
        setViewDeck(false);
    }

    useEffect(()=>{
        getDecks();
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
                                <TabButton className={styles.menuButton}>Filter</TabButton>
                                <TabButton className={styles.menuButton} onClick={() => {setViewDeck(false); setSelectedDeck({})}}>My Decks</TabButton>
                                <TabButton className={styles.menuButton}>Find Decks</TabButton>
                            </div>
                        </menu>
                    </div>
                    {viewDeck && (
                        <div className={styles.cardHead}>
                            {selectedDeck && (
                                <ListItem content={selectedDeck.Title ? selectedDeck.Title : (selectedDeck.title ? selectedDeck.title : "Untitled Deck")} contentType="Title" onChangeData={handleUpdateDeck}/>  
                            )}       
                        </div>
                    )}
                </div>
            )}
            <div className={asInset ? styles.deckContainerSmall : styles.deckContainer}>
                {!viewDeck && (<>
                    <div className={styles.emptyDecks}>{decks ? null : <p>Looks like you have no decks!</p>}</div>
                    {decks.sort((a,b) => a.title > b.title ? 1 : -1)
                    .map((deck, index) => (
                        <TabButton onClick={()=>{handleSelectDeck(deck)}}>
                            <div key={index} className={styles.deckItem}>
                                <h1>{deck.title ? deck.title : "Untitled Deck"}</h1>
                                <p>Author: {deck.username}</p>
                            </div>
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