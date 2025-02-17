import {React, useState, useEffect} from 'react';
import TabButton from '../../components/TabButton.jsx';
import ListItem from '../../components/ListItem.jsx';
import { Link, } from 'react-router'
import styles from "../../Stylesheets/Decks/Decks.module.css";

import { styled } from 'styled-components';
import StyledButton from '../../global/StyledButton.jsx';;

const StyledDecks = styled.td`
    width: 100vw;
    background-color: #ededed;
    border-color: #ababab;
    border-radius: 1px;
    height: 5vw;
    &:hover{ background-color: #ff7722; }
`


export default function Decks({...props}){
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
    

    return(
        <div id={styles.decksPage}>
            <div className={styles.searchBarContainer}>
                <label for="Search">
                    <input 
                        placeholder={"Search " + tab + " (not implemented)"}
                        className={styles.searchBar}
                    ></input>
                </label>
            </div>
            <div className={styles.deckInterfaceContainer}>
                <div className={styles.deckTabs}>
                    <menu className={styles.deckMenu}>
                        <button className={styles.menuButton} onClick={() => {setViewDeck(false); setSelectedDeck({})}}>My Decks</button>
                        {!viewDeck && (
                            <button className={styles.menuButton} onClick={createDeck}>Add Deck</button>

                        )}
                        {viewDeck && (<>
                            <button className={styles.menuButton} onClick={createCard}>Add Card</button>
                            <button className={styles.menuButton} onClick={handleDelete}>Delete This Deck</button>
                        </>)}
                    </menu>
                </div>
                <div className="deckContainer" style={{overflowY:'auto', height:'70vh', backgroundColor: '#eee'}}>
                    <table className="table">
                        {!viewDeck && (<>
                        <div className="deckHead">{decks ? "My Decks" : "No Decks"}</div>
                        <div className="deckBody">
                            {decks.map((deck) => (
                                <TabButton onClick={()=>{handleSelectDeck(deck)}}>
                                    <StyledDecks className="deck_title">
                                        {deck.Title ? deck.Title : "Untitled Deck"}
                                    </StyledDecks>
                                </TabButton>
                            ))}
                        </div>
                        </>)}
                        {viewDeck && (<>
                        <div className="cardHead">
                            {selectedDeck && (
                                <ListItem content={selectedDeck.Title ? selectedDeck.Title : "Untitled Deck"} contentType="Title" onChangeData={handleUpdateDeck}/>  
                            )}       
                        </div>
                        <div className="cardBody">
                            {cards.map((card) => (
                                <Link key={card.Card_id} to={`/cards/${card.Card_id}`}>
                                    <StyledDecks className="card_title">
                                        {card.Question ? card.Question : "Blank Card"},
                                        {card.Answer ? card.Answer : "No Answer"},
                                        {card.Incorrect1 ? card.Incorrect1 : "No Incorrect"},
                                        {card.Incorrect2 ? card.Incorrect2 : ""},
                                        {card.Incorrect3 ? card.Incorrect3 : ""},
                                        id: {card.Card_id}
                                    </StyledDecks>
                                </Link>
                                ))}
                        </div>
                        </>)}
                    </table>
                </div>
            </div>
        </div>
    );
}