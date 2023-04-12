import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import { Currency, createCheckingAccountApi } from '../api/EBankingApiService';
import { useAuth } from '../security/AuthContext';

export default function OpenAccountComponent() {
    // openAccountState { 'start', 'confirm', 'success' }

    const [openAccountState, setOpenAccountState] = useState('start');
    const [currency, setCurrency] = useState(Currency.CHF);
    const [newAccount, setNewAccount] = useState();

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();

    useEffect(() => setSuccessState(), [newAccount]);

    // Handle button actions
    function onSubmitForm() {
        if (!validForm()) {
            return;
        }

        setOpenAccountState('confirm');
    }

    function validForm() {
        return true;
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    function onConfirmForm() {
        createCheckingAccountApi(username, currency)
            .then(response => {
                console.log(response);
                setNewAccount(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function setSuccessState() {
        if (newAccount) {
            setOpenAccountState('success');
        }
    }

    return (
        <div>
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Open new checking account</h1>
            { openAccountState == 'start' &&
                <div>
                    <form>
                        <h1 className="h4 mb-2 text-royal-blue fw-bold">New checking account currency</h1>
                        <Dropdown className="mb-4">
                            <Dropdown.Toggle id="dropdown-basic" className="select-field-account">
                                {Object.keys(Currency).at(currency)}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item className="select-field-account" onClick={() => setCurrency(Currency.CHF)}>
                                    CHF
                                </Dropdown.Item>
                                <Dropdown.Item className="select-field-account" onClick={() => setCurrency(Currency.EUR)}>
                                    EUR
                                </Dropdown.Item>
                                <Dropdown.Item className="select-field-account" onClick={() => setCurrency(Currency.USD)}>
                                    USD
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <div>
                            <button className="btn btn-royal-blue px-5 mb-3" type="button" name="submit" onClick={onSubmitForm}>Next</button>
                            <br/>
                            <button className="btn btn-secondary px-5" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                        </div>
                    </form>
                </div>}

            {
                openAccountState == 'confirm' &&
                <div className="text-center">
                    <div className="mb-5">Terms and conditions</div>
                    <div>
                        <button className="btn btn-royal-blue px-5 mb-3" type="button" name="confirm" onClick={onConfirmForm}>Sign</button>
                        <br/>
                        <button className="btn btn-secondary px-5" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                    </div>
                </div>
            }
            {
                openAccountState == 'success' && newAccount &&
                <div className="text-center">
                    <div className="mb-5">Account {newAccount.accountName} with number {newAccount.accountNumber} was successfully opened.</div>
                    <br/>
                    <button className="btn btn-royal-blue px-5" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}