import React, { useState, useEffect, useContext } from 'react';
import './Card.css';


export default function Card (props) {
    return (
        <div 
            id={props.cardInfo.id? props.cardInfo.id : ''} 
            onClick={props.cardInfo.onClick? props.cardInfo.onClick : null} 
            className="card"
        >
            {props.cardInfo.imagePath
            ? <img src={ props.cardInfo.imagePath } className="card-image"/> 
            : ''}
            {props.cardInfo.text
            ? <p className="card-text">{ props.cardInfo.text }</p> 
            : ''}
            {props.cardInfo.description
            ? <p className="card-description">{ props.cardInfo.description }</p> 
            : ''}
        </div>
    );
}