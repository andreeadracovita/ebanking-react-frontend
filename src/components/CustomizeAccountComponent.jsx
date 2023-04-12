import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useAuth } from './security/AuthContext';
import { MAX_DESCRIPTION_LENGTH } from './common/constants/Constants';
import { updateBankAccountNameApi } from './api/EBankingApiService';

export default function CustomizeAccountComponent() {
    const [customizeState, setCustomizeState] = useState();
    const [account, setAccount] = useState();
    const [newName, setNewName] = useState();

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect (() => loadAccount(), []);
    useEffect (() => initPage(), [account]);

    function loadAccount() {
        if (location.state && location.state.account) {
            setAccount(location.state.account);
        }
    }

    function initPage() {
        setCustomizeState('start');
    }

    function handleNewNameChange(event) {
        if (event.target.value.length < MAX_DESCRIPTION_LENGTH) {
            setNewName(event.target.value);
        }
    }

    function onSubmitForm() {
        console.log(newName);
        const requestBody = {
            name: newName
        };
        updateBankAccountNameApi(username, account.accountNumber, requestBody)
            .then(response => {
                console.log(response);
                setCustomizeState('success');
            })
            .catch(error => {
                console.log(error);
            });
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    return (
        <div>
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Customize your account</h1>
            {
                customizeState == 'start' &&
                <div>
                    <div>
                        <p>{account.accountName}</p>
                        <p>{account.accountNumber}</p>
                        <p>{account.balance.toLocaleString("de-DE")} {account.currency}</p>
                    </div>
                    <form>
                        <div className="mb-5">
                            <input className="input-field" type="text" name="name" placeholder={account.accountName} onChange={handleNewNameChange} />
                        </div>
                        <div>
                            <button className="btn btn-royal-blue px-5 mb-3" type="button" name="submit" onClick={onSubmitForm}>Save changes</button>
                            <br/>
                            <button className="btn btn-secondary px-5" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                        </div>
                    </form>
                </div>
            }
            {
                customizeState == 'success' &&
                <div>
                    <p className='mb-5'>Name successfully changed from <span className='fw-bold'>{account.accountName}</span> to <span className='fw-bold'>{newName}</span>.</p>
                    <button className="btn btn-royal-blue px-5 mb-3" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}