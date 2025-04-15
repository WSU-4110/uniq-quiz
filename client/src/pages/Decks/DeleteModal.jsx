/* eslint-disable react/prop-types */
import {useState} from 'react';
import styles from "../../Stylesheets/Decks/Decks.module.css";

export default function Modal({open, onClose}){
    

    return(
        <div className={styles.modal}>
            {open && (
                <div className="overlay">
                    <div className="modalContainer">
                        <div className="buttonContainer">
                            <></>
                        </div>
                        <p>Are you sure you want to delete this item?</p>
                    </div>
                </div>
            )}
        </div>
    );
}