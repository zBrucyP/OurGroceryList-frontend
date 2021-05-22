import React from 'react';
import './ListCard.css';


export default function ListCard (props) {
    return (
        <div 
            id={props.id? props.id : ''} 
            onClick={props.onCardClick? props.onCardClick : null} 
            className="card"
        >
            {props.editMode
            ? <img 
                id={props.id? props.id : ''}
                src="/images/icon-remove.svg"
                className="icon-remove" 
                onClick={props.onDeleteListClick? props.onDeleteListClick : null} 
                />
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