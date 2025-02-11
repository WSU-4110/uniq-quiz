import {React, useState, useEffect} from 'react';
import TabButton from './../global/TabButton.jsx';
import { styled } from 'styled-components';
import { Link} from 'react-router';

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

    let tab='My Decks';

    if(tabChoice === 1){ tab = 'My Decks' }
    else if(tabChoice === 2){ tab = 'Community Decks' }
    else if(tabChoice === 3){ tab = 'Group Decks' }
    else if(tabChoice === 4){ tab = 'Saved Decks' }

    /**
     * @todo Add to decks controller so that it can fetch all decks by user, or all decks by group, or all decks by user saves
     * @todo For decks, add endpoint to fetch count(cards) in each deck. use rpc in supabase itself
     */
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

    const handleSelectDeck = (deck) =>{
        setSelectedDeck(deck);
        setViewDeck(true);
    }

    useEffect(()=>{
        getDecks();
    }, []);

    useEffect(() => {
        if (selectedDeck.Deck_id) {
            getCards();
        }
    }, [selectedDeck]);
    

    return(
        <div id="decksPage">
            <div className="searchBar" style={{width: '60vw', margin: 'auto',  textAlign: 'right', padding: '1rem'}}>
                <label for="Search">
                    <input placeholder={"Search " + tab}
                    style={{
                        backgroundColor: 'white',
                        backgroundImage: 'url(client/public/search-icon.png)',
                        backgroundPosition: '10px 10px',
                        backgroundRepeat: 'no-repeat',
                        paddingLeft: '40px',
                    }}></input>
                </label>
            </div>
            <div className="deckInterfaceContainer" style={{margin: 'auto', width: '60vw'}}>
                <div className="deckTabs" style={{ height: '5vw', backgroundColor: '#ddd'}}>
                    <menu style={{display: 'flex', listStyleType: 'none', padding: '0.5 0 0.5 0', margin:'0',}}>
                        <TabButton>My Decks</TabButton>
                        <TabButton>Community Decks</TabButton>
                        <TabButton>Group Decks</TabButton>
                        <TabButton>Saved Decks</TabButton>
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
                                        {deck.Title ? deck.Title : "Untitled Deck"},
                                        How Many Cards It Has, id: {deck.Deck_id}
                                    </StyledDecks>
                                </TabButton>
                            ))}
                        </div>
                        </>)}
                        {viewDeck && (<>
                        <div className="cardHead">{selectedDeck ? `Viewing Deck ${selectedDeck.Title}` : "No Deck Selected"}</div>
                        <div className="cardBody">
                            {cards.map((card) => (
                                <Link key={card.Card_id} to={`/pages/Cards/${card.Card_id}`}>
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