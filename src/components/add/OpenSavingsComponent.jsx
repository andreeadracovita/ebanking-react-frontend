import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../security/AuthContext';
import { createSavingsAccountApi } from '../api/EBankingApiService';

export default function OpenSavingsComponent() {
    // openAccountState { 'start', 'confirm', 'success' }

    const [openAccountState, setOpenAccountState] = useState('start');
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
        createSavingsAccountApi(username)
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
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Open new savings account</h1>
            { openAccountState == 'start' &&
                <div className="text-center">
                    <h1 className="h4 mb-5 text-royal-blue fw-bold">New checking account currency</h1>
                    <div>
                        <button className="btn btn-royal-blue btn-form mb-3" type="button" name="submit" onClick={onSubmitForm}>Open account</button>
                        <br/>
                        <button className="btn btn-secondary btn-form" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                    </div>
                </div>}

            {
                openAccountState == 'confirm' &&
                <div className="text-center">
                    <div className="mb-5">Terms and conditions</div>
                    <div>
                        <button className="btn btn-royal-blue btn-form mb-3" type="button" name="confirm" onClick={onConfirmForm}>Sign</button>
                        <br/>
                        <button className="btn btn-secondary btn-form" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                    </div>
                </div>
            }
            {
                openAccountState == 'success' && newAccount &&
                <div className="text-center">
                    <div className="mb-5">Account {newAccount.accountName} with number {newAccount.accountNumber} was successfully opened.</div>
                    <br/>
                    <button className="btn btn-royal-blue btn-form" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}