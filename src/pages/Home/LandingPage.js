import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import CardSet from '../../components/CardSet/CardSet';
import card from '../../models/card';
import constants from '../../utils/constants';



const cardInfoArray = () => {
    const card1 = new card(constants.LANDING_PAGE_CARD_ONE_IMAGE_PATH, constants.LANDING_PAGE_CARD_ONE_TEXT);
    const card2 = new card(constants.LANDING_PAGE_CARD_TWO_IMAGE_PATH, constants.LANDING_PAGE_CARD_TWO_TEXT);
    const card3 = new card(constants.LANDING_PAGE_CARD_THREE_IMAGE_PATH, constants.LANDING_PAGE_CARD_THREE_TEXT);
    return [card1, card2, card3];
}

export default function LandingPage() {
    const { user, setUser } = useContext(UserContext);

    return <div>
            <div className="first-half"></div>
            <div><CardSet cardInfoArr= { cardInfoArray() }/></div>
        </div>;
}
