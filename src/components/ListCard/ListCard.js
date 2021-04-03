import React from 'react';
import './ListCard.css';


export default function ListCard (props) {
    return (
        <div 
            id={props.id? props.id : ''} 
            onClick={props.onClick? props.onClick : null} 
            className="card"
        >
            {props.editMode
            ? <img 
                src="/images/icon-remove.svg"
                className="icon-remove"/>
            : ''}
            {props.listName
            ? <p className="card-text">{ props.listName }</p> 
            : ''}
            {props.listDescription
            ? <p className="card-description">{ props.listDescription }</p> 
            : ''}
        </div>
    );
}