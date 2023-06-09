import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Dropdown from 'react-bootstrap/Dropdown';

import { useAuth } from '../security/AuthContext';
import { retrievePayingBankAccountsForUsernameApi } from '../api/EBankingApiService';
import { createVirtualCardForBankAccountApi } from '../api/EBankingApiService';
import { ComponentState, ErrorMessage } from '../common/constants/Constants';
import { CHFCurrency } from '../common/helpers/HelperFunctions';

export default function CreateVirtualCardComponent() {
    const [componentState, setComponentState] = useState(ComponentState.start);
    const [accounts, setAccounts] = useState();
    const [selectedAccount, setSelectedAccount] = useState();
    const [showError, setShowError] = useState(false);

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();

    useEffect(() => {
        if (!username) {
            return;
        }

        retrievePayingBankAccountsForUsernameApi(username)
            .then(response => {
                setAccounts(response.data);
            })
            .catch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authContext]);
    useEffect(() => {
        if (accounts && accounts.length > 0) {
            setSelectedAccount(accounts[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accounts]);

    function handleSelectedAccountChange(account) {
        setSelectedAccount(account);
    }

    function onSubmitForm() {
        if (!validForm()) {
            return;
        }

        setComponentState(ComponentState.confirm);
    }

    function validForm() {
        var valid = true;

        setShowError(selectedAccount === undefined);
        valid = valid && selectedAccount !== undefined;

        return valid;
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    function onConfirmForm() {
        createVirtualCardForBankAccountApi(username, selectedAccount.accountNumber)
            .then(() => {
                setComponentState(ComponentState.success);
            })
            .catch();
    }

    return (
        <div className="main-content">
            <h1 className="main-content-title">Request new virtual card</h1>
            {
                componentState === ComponentState.start &&
                <div>
                    <h1 className="main-content-subtitle">Attach card to account</h1>
                    {
                        showError &&
                        <span className="text-danger mb-3">
                            <p>{ErrorMessage.noAccountSelected}</p>
                        </span>
                    }
                    <Dropdown className="mb-4">
                        <Dropdown.Toggle id="dropdown-basic" className="select-field-account">
                            {
                                selectedAccount &&
                                <div>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span>{selectedAccount.accountName}</span>
                                        <span className="account-balance">{CHFCurrency.format(selectedAccount.balance)}</span>
                                    </div>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span className="account-number small">{selectedAccount.accountNumber}</span>
                                        <span className="small">{selectedAccount.currency}</span>
                                    </div>
                                </div>}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {
                                accounts &&
                                accounts.filter(account => selectedAccount && account.accountNumber !== selectedAccount.accountNumber)
                                    .map(
                                    account => (
                                        <Dropdown.Item className="select-dropdown" key={account.accountNumber} onClick={() => handleSelectedAccountChange(account)}>
                                            <div>
                                                <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                    <span>{account.accountName}</span>
                                                    <span className="account-balance">{CHFCurrency.format(account.balance)}</span>
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
                componentState === ComponentState.confirm && selectedAccount &&
                <div>
                    <div className="mb-4">
                        <p className="mb-3">You requested a new virtual card for
                            <span className="fw-bold"> {selectedAccount.accountName} </span> 
                            with account number 
                            <span className="fw-bold"> {selectedAccount.accountNumber}</span>.
                        </p>
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
                componentState === ComponentState.success &&
                <div>
                    <div className="mb-4">Virtual card successfully created.</div>
                    <button className="btn btn-royal-blue btn-form" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}