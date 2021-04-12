import React from 'react';
import './ListTableRow.css';


export default function ListTableRow (props) {
    return (
        <div className="row-container">
            <div className="row-index">{props.itemIndex + 1}</div>
            {props.listItem.bought != null
            ? <span className="row-attribute-container"><p className="column-label">Bought?</p><input type="checkbox" checked={props.listItem.bought}/></span>
            : <span></span>
            }
            {props.listItem.bought != null
            ? <span className="row-attribute-container"><p className="column-label">Name:</p><input className="input-text" value={props.listItem.name}/></span>
            : <span></span>
            }
            {props.listItem.bought != null
            ? <span className="row-attribute-container"><p className="column-label">Description:</p><input className="input-text" value={props.listItem.description}/></span>
            : <span></span>
            }
            {props.listItem.bought != null
            ? <span className="row-attribute-container"><p className="column-label">Price:</p><input className="input-text" type="number" min="0.00" max="99999" step="0.01" value={props.listItem.price}/></span>
            : <span></span>
            }
            {props.listItem.bought != null
            ? <span className="row-attribute-container"><p className="column-label">Quantity:</p><input className="input-text" type="number" min="0.00" value={props.listItem.quantity}/></span>
            : <span></span>
            }
        </div>
    );
}