import React from 'react';
import './ListTableRow.css';


export default function ListTableRow (props) {
    return (
        <div className="row-container">
            <div className="row-index">{props.itemIndex + 1}</div>
            {props.listItem.bought != null
            ? <span className="row-attribute-container"><p className="columnLabel">Bought?</p><input className="input-text" type="checkbox" checked={props.listItem.bought}/></span>
            : <span></span>
            }
            {props.listItem.bought != null
            ? <span className="row-attribute-container"><p className="columnLabel">Name:</p><input value={props.listItem.name}/></span>
            : <span></span>
            }
            {props.listItem.bought != null
            ? <span className="row-attribute-container"><p className="columnLabel">Description:</p><input value={props.listItem.description}/></span>
            : <span></span>
            }
            {props.listItem.bought != null
            ? <span className="row-attribute-container"><p className="columnLabel">Price:</p><input type="number" min="0.00" max="99999" step="0.01" value={props.listItem.price}/></span>
            : <span></span>
            }
            {props.listItem.bought != null
            ? <span className="row-attribute-container"><p className="columnLabel">Quantity:</p><input type="number" min="0.00" value={props.listItem.quantity}/></span>
            : <span></span>
            }
        </div>
    );
}