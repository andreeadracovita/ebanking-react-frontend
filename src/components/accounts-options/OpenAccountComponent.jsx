import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import { createCheckingAccountApi } from '../api/EBankingApiService';
import { useAuth } from '../security/AuthContext';
import { ComponentState, Currency } from '../common/constants/Constants';

export default function OpenAccountComponent() {
    const [componentState, setComponentState] = useState(ComponentState.start);
    const [currency, setCurrency] = useState(Currency.CHF);
    const [newAccount, setNewAccount] = useState();

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();

    useEffect(() => {
        if (newAccount) {
            setComponentState(ComponentState.success);
        }
    }, [newAccount]);

    function onSubmitForm() {
        setComponentState(ComponentState.confirm);
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    function onConfirmForm() {
        createCheckingAccountApi(username, currency)
            .then(response => {
                setNewAccount(response.data);
            })
            .catch();
    }

    return (
        <div className="main-content">
            <h1 className="main-content-title">Open new checking account</h1>
            {
                componentState === ComponentState.start &&
                <div>
                    <form>
                        <h1 className="main-content-subtitle">New checking account currency</h1>
                        <Dropdown className="mb-4">
                            <Dropdown.Toggle id="dropdown-basic" className="select-field-account">
                                {Object.keys(Currency).at(currency)}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item className="select-dropdown" onClick={() => setCurrency(Currency.CHF)}>
                                    CHF
                                </Dropdown.Item>
                                <Dropdown.Item className="select-dropdown" onClick={() => setCurrency(Currency.EUR)}>
                                    EUR
                                </Dropdown.Item>
                                <Dropdown.Item className="select-dropdown" onClick={() => setCurrency(Currency.USD)}>
                                    USD
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <div>
                            <button className="btn btn-royal-blue btn-form mb-3" type="button" name="submit" onClick={onSubmitForm}>Next</button>
                            <br/>
                            <button className="btn btn-secondary btn-form" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                        </div>
                    </form>
                </div>}

            {
                componentState === ComponentState.confirm &&
                <div>
                    <div className="mb-4">
                        <p className="mb-3">You requested a new checking account.</p>
                        <p>[Terms and conditions]</p>
                        </div>
                    <div>
                        <button className="btn btn-royal-blue btn-form mb-3" type="button" name="confirm" onClick={onConfirmForm}>Sign</button>
                        <br/>
                        <button className="btn btn-secondary btn-form" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                    </div>
                </div>
            }
            {
                componentState === ComponentState.success && newAccount &&
                <div>
                    <div className="mb-4">
                        <p>Account <span className="fw-bold">{newAccount.accountName}</span> with number <span className="fw-bold">{newAccount.accountNumber}</span> was successfully opened.</p>
                        <p>The account was created with <span className="fw-bold">100 {newAccount.currency}</span> for testing purposes.</p>
                    </div>
                    <button className="btn btn-royal-blue btn-form" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}