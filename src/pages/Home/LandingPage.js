import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import CardSet from '../../components/CardSet/CardSet';
import card from '../../models/card';
import constants from '../../utils/constants';
import { Link } from 'react-router-dom';
import './LandingPage.css';



const cardInfoArray = () => {
    const card1 = new card(null, constants.LANDING_PAGE_CARD_ONE_IMAGE_PATH, constants.LANDING_PAGE_CARD_ONE_TEXT);
    const card2 = new card(null, constants.LANDING_PAGE_CARD_TWO_IMAGE_PATH, constants.LANDING_PAGE_CARD_TWO_TEXT);
    const card3 = new card(null, constants.LANDING_PAGE_CARD_THREE_IMAGE_PATH, constants.LANDING_PAGE_CARD_THREE_TEXT);
    return [card1, card2, card3];
}

export default function LandingPage() {
    const { user, setUser } = useContext(UserContext);

    return (
        <div>
            <div className="landing-first-half">
                <div className="landing-image-container">
                    <img src="/images/landing-notLoggedIn.jpg" className="landing-image" />
                </div>
                <div className="landing-greeting-cta-container">
                    <p className="landing-greeting-header"> Find Your Inner Shopping List</p>
                    <p className="landing-gretting-subtext">Learn more about what we offer</p>
                    { user.loggedIn?
                        <Link to="/dashboard">
                            <button className="landing-cta-signup-button">To Dashboard</button>
                        </Link>
                        :
                        <Link to="/signup">
                            <button className="landing-cta-signup-button">Sign Up Now!</button>
                        </Link>
                    }
                </div>
            </div>
            <div><CardSet cardInfoArr= { cardInfoArray() }/></div>
        </div>
    );
}
