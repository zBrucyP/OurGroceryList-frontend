import React, { useState, useEffect, useContext } from 'react';
import './ListTableRow.css';


export default function ListTableRow (props) {

    function changeSetup(e) {
        props.handleChange(props.itemIndex, e.target.name, e.target.value);
    }

    function changeSetupCheckBox(e) {
        props.handleChange(props.itemIndex, e.target.name, e.target.checked);
    }

    return (
        <div className="row-container">
            <div className="row-index">{props.itemIndex + 1}</div>
            {props.listItem.bought != null
            ? <span className="row-attribute-container">
                <p className="column-label">Bought?</p>
                <input type="checkbox" name="bought" defaultChecked={props.listItem.bought} onChange={(e) => changeSetupCheckBox(e)}/></span>
            : <span></span>
            }
            {props.listItem.name != null
            ? <span className="row-attribute-container">
                <p className="column-label">Name:</p>
                <input className="input-text" name="name" defaultValue={props.listItem.name} onChange={(e) => changeSetup(e)}/>
              </span>
            : <span></span>
            }
            {props.listItem.description != null
            ? <span className="row-attribute-container">
                <p className="column-label">Description:</p>
                <input className="input-text" name="description" defaultValue={props.listItem.description} onChange={(e) => changeSetup(e)}/></span>
            : <span></span>
            }
            {props.listItem.price != null
            ? <span className="row-attribute-container">
                <p className="column-label">Price:</p>
                <input className="input-text" name="price" type="number" min="0.00" max="99999" step="0.01" defaultValue={props.listItem.price} onChange={(e) => changeSetup(e)}/></span>
            : <span></span>
            }
            {props.listItem.quantity != null
            ? <span className="row-attribute-container">
                <p className="column-label">Quantity:</p>
                <input className="input-text" name="quantity" type="number" min="0.00" defaultValue={props.listItem.quantity} onChange={(e) => changeSetup(e)}/></span>
            : <span></span>
            }
        </div>
    );
}