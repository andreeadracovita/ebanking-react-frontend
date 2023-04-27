import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../security/AuthContext';
import { createSavingsAccountApi } from '../api/EBankingApiService';
import { ComponentState } from '../common/constants/Constants';

export default function OpenSavingsComponent() {
    const [componentState, setComponentState] = useState(ComponentState.start);
    const [newAccount, setNewAccount] = useState();

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();

    useEffect(() => {
        if (newAccount) {
            setComponentState(ComponentState.success);
        }
    }, [newAccount]);

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    function onConfirm() {
        createSavingsAccountApi(username)
            .then(response => {
                setNewAccount(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div className="main-content">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Open new savings account</h1>
            {
                componentState === ComponentState.start &&
                <div>
                    <h1 className="h4 mb-5 text-royal-blue fw-bold">You requested a new savings account.</h1>
                    <div className="mb-5">[Terms and conditions]</div>
                    <div>
                        <button className="btn btn-royal-blue btn-form mb-3" type="button" name="submit" onClick={onConfirm}>Sign</button>
                        <br/>
                        <button className="btn btn-secondary btn-form" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                    </div>
                </div>
            }

            {
                componentState === ComponentState.success && newAccount &&
                <div>
                    <div className="mb-5">Savings account {newAccount.accountName} with number {newAccount.accountNumber} was successfully opened.</div>
                    <br/>
                    <button className="btn btn-royal-blue btn-form" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}