import { useEffect, useState } from 'react';

import { useAuth } from '../security/AuthContext';
import {
    retrieveAllCardsForUsernameApi,
    retrieveCheckingAccountsForUsernameApi,
    retrieveCreditAccountsForUsernameApi,
    retrieveSavingsAccountsForUsernameApi,
} from '../api/EBankingApiService';
import AccountsComponent from './AccountsComponent';
import CardsComponent from './CardsComponent';

export default function PortfolioComponent() {
    const [checkingAccounts, setCheckingAccounts] = useState([]);
    const [savingsAccounts, setSavingsAccounts] = useState([]);
    const [creditAccounts, setCreditAccounts] = useState([]);
    const [cards, setCards] = useState([]);

    const authContext = useAuth();
    const username = authContext.username;

    useEffect (() => {
        if (!username) {
            return;
        }

        retrieveCheckingAccountsForUsernameApi(username)
            .then(response => {
                setCheckingAccounts(response.data);
            })
            .catch();
        
        retrieveSavingsAccountsForUsernameApi(username)
            .then(response => {
                setSavingsAccounts(response.data);
            })
            .catch();

        retrieveCreditAccountsForUsernameApi(username)
            .then(response => {
                setCreditAccounts(response.data);
            })
            .catch();
        
        retrieveAllCardsForUsernameApi(username)
            .then(response => {
                setCards(response.data);
            })
            .catch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authContext]);

    return (
        <div className="main-content">
            <h1 className="main-content-title">Portfolio</h1>
            <div className="d-flex flex-wrap justify-content-left">
                <div style={{marginRight:20+'px'}}>
                    <div className="portfolio-section"><AccountsComponent type='CHECKING' accounts={checkingAccounts} /></div>
                    <div className="portfolio-section"><AccountsComponent type='SAVINGS' accounts={savingsAccounts} /></div>
                </div>
                <div>
                    <div className="portfolio-section"><AccountsComponent type='CREDIT' accounts={creditAccounts} /></div>
                    <div className="portfolio-section"><CardsComponent cards={cards} setCards={setCards} /></div>
                </div>
            </div>
        </div>
    );
}