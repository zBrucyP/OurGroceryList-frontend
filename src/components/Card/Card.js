import React, { useState, useEffect, useContext } from 'react';
import './Card.css';


export default function Card (props) {
    return (
        <div className="card">
            <img src={ props.cardInfo.imagePath } className="card-image"/>
            <p className="card-text">{ props.cardInfo.text }</p>
        </div>
    );
}