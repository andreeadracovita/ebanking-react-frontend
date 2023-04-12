import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { deleteBankAccountApi } from './api/EBankingApiService';
import { useAuth } from './security/AuthContext';

export default function DeleteConfirmComponent() {
    const [deleteState, setDeleteState] = useState('confirm');
    const [showBalanceError, setShowBalanceError] = useState();

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();

    const location = useLocation();
    const account = location.state.account;

    function onConfirm() {
        if (!account) {
            return;
        }

        if (account.balance > 0.0) {
            setShowBalanceError(true);
            return;
        }

        deleteBankAccountApi(username, account.accountNumber)
            .then(response => {
                console.log(response);
                setDeleteState('success');
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
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Delete confirmation</h1>
            {
                deleteState == 'confirm' && account &&
                <div className="text-center">
                    { showBalanceError && <div className="mb-3 text-danger">Empty the account before proceeding.</div> }
                    <div className="mb-5">You want to delete account <span className="fw-bold">{account.accountName}</span> with number <span className="fw-bold">{account.accountNumber}</span>.</div>
                    <div>
                        <button className="btn btn-royal-blue px-5 mb-3" type="button" name="confirm" onClick={onConfirm}>Sign</button>
                        <br/>
                        <button className="btn btn-secondary px-5" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                    </div>
                </div>
            }
            {
                deleteState == 'success' &&
                <div className="text-center">
                    <div className="mb-5">Account <span className="fw-bold">{account.accountName}</span> with number <span className="fw-bold">{account.accountNumber}</span> was successfully deleted.</div>
                    <br/>
                    <button className="btn btn-royal-blue px-5" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}