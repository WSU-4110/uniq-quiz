import {useState} from 'react';
import styles from "../../Stylesheets/Groups/Group.module.css";

export default function DeleteModal({decks, onSelect, onClose}){
    const [myDecks, setMyDecks] = useState(decks);
    const [deck, setDeck] = useState({});

    return(
        <div className={styles.modal}>
            <form onSubmit={(e) => { e.preventDefault(); onSelect(deck); }}>
                {myDecks.map(
                    (deck, index) => (<>
                    <input type="radio" id={deck.title} name="Deck Selection" value={deck.title}
                    onChange={(e) => setDeck(myDecks.find(d => d.title === e.target.value))}/>
                    <label htmlFor={deck.title}>{deck.title}</label><br/>
                    </>)
                )}
                <button className={styles.menuButton} type="submit" >Submit</button>
                <button className={styles.menuButton} type="button" onClick={onClose}>Close</button>
            </form>
        </div>
    );
}