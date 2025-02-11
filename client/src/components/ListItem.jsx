import {useState} from 'react';
export default function ListItem({content, contentType, onChangeData, isActive = true}){
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
        <li className={isActive ? 'active' : undefined}>
          <span className="item">
            {!edit && (<span className="itemContent">{thisContent}</span>)}
            {edit && (<input type="text" required value={thisContent} onChange={handleChange}></input>)}
          </span>
            <button onClick={handleEdit}>{!edit && "Edit"}{edit && "Save"}</button>
        </li>
    </>);
}