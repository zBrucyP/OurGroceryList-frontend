import React, { useState, useEffect, useContext } from 'react';
import Card from '../Card/Card'
import './CardSet.css'

export default function CardSet (props) {
    return (
        <div className="card-holder">
            {
                props ?
                    props.cardInfoArr.map((obj, idx) => {
                        return <Card key={idx} cardInfo={ obj }/>
                    })
                :
                    ''
            }
        </div>
    );
}