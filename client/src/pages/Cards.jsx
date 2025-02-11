import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ListItem from '../components/ListItem';

export default function Cards(){
    const params = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState({});
    
    const getCard = async () =>{
      try{
        const response = await fetch(`http://localhost:3000/api/cards/${params.card_id}/card`);
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
          const response = await fetch(`http://localhost:3000/api/cards/${params.card_id}`, {
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
      console.log("effect triggered");
      if (Object.keys(card).length > 0) {
        updateCard();
      } 
    }, [card])

    return (
        <>
          <h1>Editing Card ID: {params.card_id}</h1>
          <p>{card.Question ? card.Question : "No Data"}</p>
          <div className="cardEditor" key={card.Question}>
              <img src={card.image ? card.image : null} alt="Placeholder"/>
              <ListItem content={card.Question} contentType="Question" onChangeData={handleSave}/>
              <ListItem content={card.Answer} contentType="Answer" onChangeData={handleSave}/>
              <ListItem content={card.Incorrect1} contentType="Incorrect1" onChangeData={handleSave}/>
              <ListItem content={card.Incorrect2} contentType="Incorrect2" onChangeData={handleSave}/>
              <ListItem content={card.Incorrect3} contentType="Incorrect3" onChangeData={handleSave}/>
          </div>
          <div className="buttonContainer">
            <button id="close" onClick={() => handleClose()}>Close</button>
          </div>
        </>
      );
}