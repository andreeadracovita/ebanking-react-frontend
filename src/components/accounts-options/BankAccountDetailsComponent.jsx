import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { retrieveCustomerNameForCustomerIdApi } from '../api/EBankingApiService';
import { useAuth } from '../security/AuthContext';

export default function BankAccountDetailsComponent() {
    const [account, setAccount] = useState();
    const [customerName, setCustomerName] = useState();

    const authContext = useAuth();
    const username = authContext.username;

    const location = useLocation();
    const navigate = useNavigate();

    useEffect (() => {
        if (location.state && location.state.account) {
            setAccount(location.state.account);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect (() => {
        if (account) {
            retrieveCustomerNameForCustomerIdApi(username, account.customerId)
                .then(response => {
                    setCustomerName(response.data);
                })
                .catch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    return (
        <div className="main-content">
            {
                account && customerName &&
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