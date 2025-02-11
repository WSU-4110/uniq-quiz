import { useParams } from 'react-router-dom';

export default function Cards(){
    const { card_id } = useParams();

    return (
        <>
          <h1>Editing Card: {card_id}</h1>
        </>
      );
}