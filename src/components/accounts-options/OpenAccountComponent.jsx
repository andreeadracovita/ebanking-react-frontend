import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import { Currency, createCheckingAccountApi } from '../api/EBankingApiService';
import { useAuth } from '../security/AuthContext';
import { ComponentState } from '../common/constants/Constants';

export default function OpenAccountComponent() {
    const [componentState, setComponentState] = useState(ComponentState.start);
    const [currency, setCurrency] = useState(Currency.CHF);
    const [newAccount, setNewAccount] = useState();

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();

    useEffect(() => setSuccessState(), [newAccount]);

    function onSubmitForm() {
        setComponentState(ComponentState.confirm);
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    function onConfirmForm() {
        createCheckingAccountApi(username, currency)
            .then(() => {
                setNewAccount(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function setSuccessState() {
        if (newAccount) {
            setComponentState(ComponentState.success);
        }
    }

    return (
        <div className="main-content">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Open new checking account</h1>
            {
                componentState === ComponentState.start &&
                <div>
                    <form>
                        <h1 className="h4 mb-2 text-royal-blue fw-bold">New checking account currency</h1>
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
                    <div className="mb-5">
                        <p className="mb-4">You requested a new {currency} checking account.</p>
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
                    <div className="mb-5">Account <span className="fw-bold">{newAccount.accountName}</span> with number <span className="fw-bold">{newAccount.accountNumber}</span> was successfully opened.</div>
                    <br/>
                    <button className="btn btn-royal-blue btn-form" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}