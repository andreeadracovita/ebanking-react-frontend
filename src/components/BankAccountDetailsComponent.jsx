import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { retrieveCustomerNameForCustomerIdApi } from './api/EBankingApiService';
import { useAuth } from './security/AuthContext';

export default function BankAccountDetailsComponent() {
    const [account, setAccount] = useState();
    const [customerName, setCustomerName] = useState();
    const [loadContent, setLoadContent] = useState();

    const authContext = useAuth();
    const username = authContext.username;

    const location = useLocation();
    const navigate = useNavigate();

    useEffect (() => loadAccount(), []);
    useEffect (() => loadCustomerName(), [account]);
    useEffect (() => activateLoadContent(), [customerName]);

    function loadAccount() {
        if (location.state && location.state.account) {
            setAccount(location.state.account);
        }
    }

    function loadCustomerName() {
        if (account) {
            retrieveCustomerNameForCustomerIdApi(username, account.customerId)
                .then(response => {
                    setCustomerName(response.data);
                })
                .catch(error => console.log(error));
        }
    }

    function activateLoadContent() {
        if (customerName) {
            setLoadContent(true);
        }
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    return (
        <div className="main-content">
            {
                loadContent &&
                <div>
                    <p>Bank account number</p>
                    <p className="ms-3 fw-bold">{account.accountNumber}</p>
                    <br/>
                    <p>Account owner</p>
                    <p className="ms-3 fw-bold">{customerName}</p>
                    <br/>
                    <p>Currency</p>
                    <p className="ms-3 fw-bold">{account.currency}</p>
                    <button className="btn btn-royal-blue btn-form mt-3" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}