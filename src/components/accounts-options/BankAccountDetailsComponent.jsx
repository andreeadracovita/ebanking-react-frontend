import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

export default function BankAccountDetailsComponent() {
    const [account, setAccount] = useState();
    const [customerName, setCustomerName] = useState();

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
            setCustomerName(account.customer.firstName + ' ' + account.customer.lastName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    return (
        <div className="main-content">
            <h1 className="main-content-title">Bank account details</h1>
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