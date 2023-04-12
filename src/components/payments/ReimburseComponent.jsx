import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';

import { MAX_DESCRIPTION_LENGTH } from '../common/constants/Constants';
import { useAuth } from '../security/AuthContext';
import { retrieveAllLocalCheckingBankAccountsForUsernameApi } from '../api/EBankingApiService';
import PaymentConfirmComponent from './PaymentConfirmComponent';
import PaymentSuccessComponent from './PaymentSuccessComponent';
import PaymentFailureComponent from './PaymentFailureComponent';

export default function ReimburseComponent() {
    const [paymentState, setPaymentState] = useState();
    const [showError, setShowError] = useState();
    const [toAccount, setToAccount] = useState();
    const [selectedFromAccount, setSelectedFromAccount] = useState();
    const [accounts, setAccounts] = useState([]);
    const [amount, setAmount] = useState();
    const [description, setDescription] = useState('');

    const transactionDefault = {
        id: -1,
        fromAccountNumber: null,
        toAccountNumber: null,
        beneficiaryName: null,
        amount: 0,
        currency: 0,
        description: ''
    };

    const [transaction, setTransaction] = useState(transactionDefault);

    const [amountPlaceholder, setAmountPlaceholder] = useState();

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect (() => setCreditAccount(), [])
    useEffect (() => refreshAccounts(), [toAccount]);
    useEffect (() => setValuesAfterAccountsLoad(), [accounts]);
    useEffect (() => initPage(), [selectedFromAccount]);

    function setCreditAccount() {
        if (location && location.state && location.state.account) {
            setToAccount(location.state.account);
            setAmountPlaceholder('Amount (' + location.state.account.currency + ')');
        }
    }

    function refreshAccounts() {
        retrieveAllLocalCheckingBankAccountsForUsernameApi(username)
            .then(response => {
                setAccounts(response.data);
            })
            .catch(error => console.log(error));
    }

    function setValuesAfterAccountsLoad() {
        if (selectedFromAccount == null && accounts.length > 0) {
            setSelectedFromAccount(accounts[0]);
        }
    }

    function initPage() {
        if (toAccount && selectedFromAccount) {
            setPaymentState('start');
        }
    }

    function handleSelectFromAccountChange(account) {
        setSelectedFromAccount(account);
    }

    function checkAmountInput(event) {
        var key = event.keyCode;

        // Allow input if arrows, delete, backspace, digits and point keys were pressed 
        if(key == 37 || key == 38 || key == 39 || key == 40 || key == 8 || key == 46 ||
            /[0-9]|\./.test(event.key)) {
            return;
        }
        event.preventDefault();
    }

    function handleAmountChange(event) {
        if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(event.target.value)) {
            event.preventDefault();
            return;
        }

        setAmount(event.target.value);
    }

    function handleDescriptionChange(event) {
        if (event.target.value.length < MAX_DESCRIPTION_LENGTH) {
            setDescription(event.target.value);
        }
    }

    // Handle button actions
    function onSubmitForm() {
        if (!validForm()) {
            setShowError(true);
            return;
        }

        const newTransaction = {
            id: -1,
            fromAccountNumber: selectedFromAccount.accountNumber,
            toAccountNumber: location.state.account.accountNumber,
            amount: amount,
            currency: selectedFromAccount.currency,
            description: description,
            exchangeRate: 1.0
        };

        setTransaction(newTransaction);
        setPaymentState('confirm');
    }

    function validForm() {
        if (!amount || amount <= 0) {
            return false;
        }

        return true;
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    return (
        <div>
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Reimburse credit card</h1>
            {
                paymentState == 'start' &&
                <div>
                    {
                        showError &&
                        <div className="text-danger mb-3 fw-bold">
                            <p>Amount must be larger than 0.</p>
                        </div>
                    }
                    <h1 className="h4 mb-2 text-royal-blue fw-bold">To account</h1>
                    <p className="mb-4">{toAccount.accountName}</p>

                    <form>
                        <div className="mb-3">
                            <input className="input-field" type="number" name="amount" placeholder={amountPlaceholder} onChange={handleAmountChange} onKeyDown={checkAmountInput}/>
                        </div>

                        <h1 className="h4 mb-2 text-royal-blue fw-bold">From account</h1>
                        <Dropdown className="mb-4">
                            <Dropdown.Toggle id="dropdown-basic" className="select-field-account">
                                { selectedFromAccount &&
                                    <div>
                                        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                            <span>{selectedFromAccount.accountName}</span>
                                            <span className="account-balance">{selectedFromAccount.balance.toLocaleString("de-DE")}</span>
                                        </div>
                                        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                            <span className="account-number">{selectedFromAccount.accountNumber}</span>
                                            <span>{selectedFromAccount.currency}</span>
                                        </div>
                                    </div>
                                }
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                            {
                                accounts.filter(account => selectedFromAccount && account.accountNumber !== selectedFromAccount.accountNumber)
                                    .map(
                                        account => (
                                            <Dropdown.Item className="select-field-account" key={account.accountNumber} onClick={() => handleSelectFromAccountChange(account)}>
                                                <div>
                                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                        <span>{account.accountName}</span>
                                                        <span className="account-balance">{account.balance.toLocaleString("de-DE")}</span>
                                                    </div>
                                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                        <span className="account-number">{account.accountNumber}</span>
                                                        <span>{account.currency}</span>
                                                    </div>
                                                </div>
                                            </Dropdown.Item>
                                        )
                                    )
                            }
                            </Dropdown.Menu>
                        </Dropdown>

                        <h1 className="h4 mb-2 text-royal-blue fw-bold">Transfer details (optional)</h1>
                        <div className="mb-5">
                            <input className="input-field" type="text" name="description" placeholder="Description" value={description} onChange={handleDescriptionChange} />
                        </div>

                        <div>
                            <button className="btn btn-royal-blue px-5 mb-3" type="button" name="submit" onClick={onSubmitForm}>Next</button>
                            <br/>
                            <button className="btn btn-secondary px-5" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                        </div>
                    </form>
                </div>}

            {
                paymentState == 'confirm' &&
                <PaymentConfirmComponent paymentType='self' transaction={transaction} setPaymentState={setPaymentState}/>
            }
            {
                paymentState == 'success' &&
                <PaymentSuccessComponent amount={{value:transaction.amount, currency:transaction.currency}} destination={location.state.account.accountName} setPaymentState={setPaymentState}/>
            }
            {
                paymentState == 'fail' &&
                <PaymentFailureComponent setPaymentState={setPaymentState}/>
            }
        </div>
    );
}