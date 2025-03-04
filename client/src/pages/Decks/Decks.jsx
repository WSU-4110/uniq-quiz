import {React, useState, useEffect} from 'react';
import TabButton from '../../components/TabButton.jsx';
import ListItem from '../../components/ListItem.jsx';
import ProfileBanner from '../../components/ProfileBanner.jsx';
import { Link, } from 'react-router'
import styles from "../../Stylesheets/Decks/Decks.module.css";


export default function Decks({asInset = false, showOnlyDecks = false}){
    const [tabChoice, setTabChoice] = useState(1);
    const [decks, setDecks] = useState([]);
    const [cards, setCards] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState({});
    const [viewDeck, setViewDeck] = useState(false);
    const [refresh, setRefresh] = useState(0);

    let tab='My Decks';

    if(tabChoice === 1){ tab = 'My Decks' }
    else if(tabChoice === 2){ tab = 'Community Decks' }
    else if(tabChoice === 3){ tab = 'Group Decks' }
    else if(tabChoice === 4){ tab = 'Saved Decks' }

    const getDecks = async() =>{
        try {
            const response = await fetch("http://localhost:3000/api/decks/");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            const jsonData = await response.json();
            setDecks(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    }

    const createDeck = async() => {
        try{
            const body = {Title: "Untitled Deck", User_id: "5c230d10-4e3a-4ae1-a6b1-e3063299ced6"};
            const response = await fetch("http://localhost:3000/api/decks/",{
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            const jsonData = await response.json();
            if(!response.ok) {
                throw new Error(`Failed to create deck: ${response.statusText}`);
            }
            setRefresh(prev => prev + 1);
        } catch (error){
            console.error(error.message);
        }
    }
    
    const updateDeck = async() =>{
        try{
            const body = selectedDeck;
            if(!selectedDeck){
                throw new Error(`No deck selected!`);
            }
            console.log(selectedDeck.Deck_id);
            const response = await fetch(`http://localhost:3000/api/decks/${selectedDeck.Deck_id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
            }
          );
          if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const jsonData = response.json();
        }catch(error){
          console.error(error.message);
        }
    }

    const getCards = async () =>{
        if (!selectedDeck.Deck_id) {
            console.warn("No deck selected, skipping card fetch.");
            return;
        }

        try{
            const response = await fetch(`http://localhost:3000/api/cards/${selectedDeck.Deck_id}`)
            if (!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonData = await response.json();
            setCards(jsonData);
        } catch (error){
          console.error(error.message);  
        }
    }

    const createCard = async() => {
        try{
            const body = {Deck_id: selectedDeck.Deck_id, Question: "", Answer: "", Incorrect1: "", Incorrect2: "", Incorrect3: ""};
            const response = await fetch(`http://localhost:3000/api/cards/${selectedDeck.Deck_id}`,{
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            const jsonData = await response.json();
            console.log(jsonData);
            setRefresh(prev => prev + 1);
        } catch (error){
            console.error(error.message);
        }
    }

    const deleteDeck = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/decks/${selectedDeck.Deck_id}`, {
                method: "DELETE"
            });
            setDecks(decks.filter(decks => decks.Deck_id !== selectedDeck.Deck_id));
            setRefresh(prev => prev + 1);
        } catch (error) {
            console.error(error.message);
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
        if (selectedDeck.Deck_id) {
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
                                <ListItem content={selectedDeck.Title ? selectedDeck.Title : "Untitled Deck"} contentType="Title" onChangeData={handleUpdateDeck}/>  
                            )}       
                        </div>
                    )}
                </div>
            )}
            <div className={asInset ? styles.deckContainerSmall : styles.deckContainer}>
                {!viewDeck && (<>
                    <div className={styles.emptyDecks}>{decks ? null : <p>Looks like you have no decks!</p>}</div>
                    {decks.sort((a,b) => a.Title > b.Title ? 1 : -1)
                    .map((deck) => (
                        <TabButton onClick={()=>{handleSelectDeck(deck)}}>
                            <div className={styles.deckItem}>
                                <h1>{deck.Title ? deck.Title : "Untitled Deck"}</h1>
                                <p></p>
                            </div>
                        </TabButton>
                    ))}
                </>)}
                {viewDeck && (<>
                    {cards.sort((a,b) => a.Card_id > b.Card_id ? 1 : -1)
                    .map((card) => (
                        <Link key={card.Card_id} to={`/cards/${card.Card_id}`}>
                            <div className={styles.deckItem}>
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