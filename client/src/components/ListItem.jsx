import {useState} from 'react';
import styles from './../Stylesheets/Components/ListItem.module.css';

export default function ListItem({content, contentType, onChangeData, isActive = true, header=null}){
    const [edit, setEdit] = useState(false);
    const [thisContent, setContent] = useState(content);

  function handleEdit(){
    setEdit((editing) => !edit);
    if (edit){
        console.log(onChangeData);
        onChangeData(contentType, thisContent);
    }
  }
  function handleChange(event){
    setContent(event.target.value);
  }

    return(<>
        <li className={isActive ? `${styles.active} ${styles.li}` : styles.li}>
          <span className={styles.item}>
            {header && (<h2>{header}</h2>)}
            {!edit && (<span className={styles.content}>{thisContent}</span>)}
            {edit && (<input className={styles.input} type="text" required value={thisContent} onChange={handleChange}></input>)}
          </span>
            <button className={styles.button} onClick={handleEdit}>{!edit && "Edit"}{edit && "Save"}</button>
        </li>
    </>);
}