import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ListItem from '../../components/ListItem';
import styles from '../../Stylesheets/Decks/Cards.module.css';

export default function Cards(){
    const params = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState({});
    
    const getCard = async () =>{
      try{
        const response = await fetch(`/api/cards/${params.card_id}/card`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        const [jsonData] = await response.json();
        setCard(jsonData);
      }catch(error){
        console.error(error.message);
      }
    }

    const updateCard = async() =>{
      try{
          const body = card;
          const response = await fetch(`/api/cards/${params.card_id}`, {
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

    const deleteCard = async () => {
      try {
          const response = await fetch(`/api/cards/${params.card_id}`, {
              method: "DELETE"
          });
          handleClose();
      } catch (error) {
          console.error(error.message);
      }
  }

    function handleSave(property, newProperty){
      setCard(prevCard => ({
        ...prevCard,
        [property]: newProperty
      }));
    }
    function handleClose(){
      navigate(-1);
    }

    useEffect(()=>{
        getCard();
    }, [params.card_id]);

    useEffect(()=>{
      if (Object.keys(card).length > 0) {
        updateCard();
      } 
    }, [card])

    return (<>
        <div className={styles.card}>
          <h1>Editing Card</h1>
            <div className={styles.cardEditor} key={card.Question}>
              <img className={card.image ? styles.image : styles.noDisplay} src={card.image ? card.image : null} alt="Placeholder"/>
              <div className={styles.gridContainer}>
                <div className={styles.gridRow}>
                  <ListItem content={card.Question} header="Question" contentType="Question" onChangeData={handleSave}/>
                </div>
                <div className={styles.gridRow}>
                  <ListItem content={card.Answer} header="Answer" contentType="Answer" onChangeData={handleSave}/>
                  <ListItem content={card.Incorrect1} header="Incorrect 1" contentType="Incorrect1" onChangeData={handleSave}/>
                </div>
                <div className={styles.gridRow}>
                  <ListItem content={card.Incorrect2} header="Incorrect 2" contentType="Incorrect2" onChangeData={handleSave}/>
                  <ListItem content={card.Incorrect3} header="Incorrect 3" contentType="Incorrect3" onChangeData={handleSave}/>
                </div>
              </div>
            </div>
          <div className={styles.buttonContainer}>
            <button class={styles.button} onClick={() => handleClose()}>Close</button>
            <button class={`${styles.button} ${styles.delete}`} onClick={deleteCard}>Delete Card</button>
          </div>
        </div>
      </>);
}