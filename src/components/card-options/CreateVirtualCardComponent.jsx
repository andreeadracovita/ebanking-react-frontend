import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Dropdown from 'react-bootstrap/Dropdown';

import { useAuth } from '../security/AuthContext';
import { retrievePayingBankAccountsForUsernameApi } from '../api/EBankingApiService';
import { createVirtualCardForBankAccountApi } from '../api/EBankingApiService';

export default function CreateVirtualCardComponent() {
    // componentState { 'start', 'confirm', 'success' }

    const [componentState, setComponentState] = useState();
    const [accounts, setAccounts] = useState();
    const [selectedAccount, setSelectedAccount] = useState();

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();

    useEffect(() => refreshAccounts(), []);
    useEffect(() => initSelectedAfterLoad(), [accounts]);
    useEffect(() => initComponent(), [selectedAccount]);

    function refreshAccounts() {
        retrievePayingBankAccountsForUsernameApi(username)
            .then(response => {
                setAccounts(response.data);
            })
            .catch(error => console.log(error));
    }

    function initSelectedAfterLoad() {
        if (accounts && accounts.length > 0) {
            setSelectedAccount(accounts[0]);
        }
    }

    function initComponent() {
        if (selectedAccount) {
            setComponentState('start');
        }
    }

    function handleSelectedAccountChange(account) {
        setSelectedAccount(account);
    }

    function onSubmitForm() {
        setComponentState('confirm');
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    function onConfirmForm() {
        createVirtualCardForBankAccountApi(username, selectedAccount.accountNumber)
            .then(() => {
                setComponentState('success');
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div className="main-content">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Request new virtual card</h1>
            { componentState == 'start' &&
                <div>
                    <h1 className="h4 mb-4 text-royal-blue fw-bold">Attach card to account</h1>
                    <Dropdown className="mb-5">
                        <Dropdown.Toggle id="dropdown-basic" className="select-field-account">
                            {
                                selectedAccount &&
                                <div>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span>{selectedAccount.accountName}</span>
                                        <span className="account-balance">{selectedAccount.balance.toLocaleString("de-CH")}</span>
                                    </div>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span className="account-number small">{selectedAccount.accountNumber}</span>
                                        <span className="small">{selectedAccount.currency}</span>
                                    </div>
                                </div>}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {
                                accounts.map(
                                    account => (
                                        <Dropdown.Item className="select-dropdown" key={account.accountNumber} onClick={() => handleSelectedAccountChange(account)}>
                                            <div>
                                                <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                    <span>{account.accountName}</span>
                                                    <span className="account-balance">{account.balance.toLocaleString("de-CH")}</span>
                                                </div>
                                                <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                    <span className="account-number small">{account.accountNumber}</span>
                                                    <span className="small">{account.currency}</span>
                                                </div>
                                            </div>
                                        </Dropdown.Item>
                                    )
                                )
                            }
                        </Dropdown.Menu>
                    </Dropdown>

                    <div>
                        <button className="btn btn-royal-blue btn-form mb-3" type="button" name="submit" onClick={onSubmitForm}>Next</button>
                        <br/>
                        <button className="btn btn-secondary btn-form" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                    </div>
                </div>}

            {
                componentState == 'confirm' &&
                <div>
                    <div className="mb-5">
                        <p className="mb-4">You requested a new virtual card for
                            <span className="fw-bold"> {selectedAccount.accountName} </span> 
                            with account number 
                            <span className="fw-bold"> {selectedAccount.accountNumber}</span>.</p>
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
                componentState == 'success' &&
                <div>
                    <div className="mb-5">Virtual card successfully created.</div>
                    <br/>
                    <button className="btn btn-royal-blue btn-form" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}