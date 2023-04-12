import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Dropdown } from 'react-bootstrap';

import { useAuth } from '../security/AuthContext';
import PaymentConfirmComponent from './PaymentConfirmComponent';
import PaymentSuccessComponent from './PaymentSuccessComponent';
import PaymentFailureComponent from './PaymentFailureComponent';
import { retrieveCheckingAccountsForUsernameApi } from '../api/EBankingApiService';

const exchangeRate = {
    CHF:  1,
    EUR: 0.9,
    USD: 0.8
};

export default function ExchangeComponent() {
    // PaymentState { 'start', 'confirm', 'success', 'fail' }

    const [loadContent, setLoadContent] = useState();
    const [paymentState, setPaymentState] = useState();

    const [accounts, setAccounts] = useState([]);
    const [selectedFromAccount, setSelectedFromAccount] = useState();
    const [selectedToAccount, setSelectedToAccount] = useState();
    const [amount, setAmount] = useState();
    const [debitAmount, setDebitAmount] = useState();
    const [convertedAmount, setConvertedAmount] = useState();
    const [currencySelect, setCurrencySelect] = useState();

    const [showError, setShowError] = useState(false);

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

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();

    useEffect (() => refreshAccounts(), []); // once at page load
    useEffect (() => setFromAccountAfterAccountsLoad(), [accounts]); // catch accounts load
    useEffect (() => setToAccountAfterFromAccountLoad(), [selectedFromAccount]); // catch from account load
    useEffect (() => initPage(), [selectedToAccount]); // catch selected accounts load
    useEffect (() => recomputeTransactionAmounts(), [amount, currencySelect]);

    function refreshAccounts() {
        retrieveCheckingAccountsForUsernameApi(username)
            .then(response => {
                setAccounts(response.data);
            })
            .catch(error => console.log(error));
    }

    function setFromAccountAfterAccountsLoad() {
        if (selectedFromAccount == null && accounts.length > 0) {
            setSelectedFromAccount(accounts[0]);
            setCurrencySelect(accounts[0].currency);
        }
    }

    function setToAccountAfterFromAccountLoad() {
        if (accounts.length > 0) {
            const firstInvCurrencyAccounts = accounts.filter(account => account.currency !== selectedFromAccount.currency);
            if (selectedToAccount == null && firstInvCurrencyAccounts.length > 0) {
                setSelectedToAccount(firstInvCurrencyAccounts[0]);
            }
        }
    }

    function initPage() {
        setPaymentState('start');
        setLoadContent(true);
    }

    function handleSelectFromAccountChange(account) {
        const prevSelectedFromAccount = selectedFromAccount;
        setSelectedFromAccount(account);
        if (account.accountNumber == selectedToAccount.accountNumber) {
            setSelectedToAccount(prevSelectedFromAccount);
        }
    }

    function handleSelectToAccountChange(account) {
        setSelectedToAccount(account);
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

    function chooseRate(currency) {
        var rate = 1;
        if (currency == 'EUR') {
            rate = exchangeRate.EUR;
        } else if (currency == 'USD') {
            rate = exchangeRate.USD;
        }
        return rate;
    }

    function recomputeTransactionAmounts() {
        if  (selectedFromAccount && selectedToAccount) {
            if (currencySelect == selectedFromAccount.currency) {
                setDebitAmount(amount);
                setConvertedAmount((amount / chooseRate(selectedToAccount.currency)).toFixed(2));
            } else {
                setDebitAmount((amount * chooseRate(currencySelect)).toFixed(2));
                setConvertedAmount(amount);
            }
        }
    }

    function handleCurrencySelectChange(event) {
        setCurrencySelect(event.target.value);
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
            toAccountNumber: selectedToAccount.accountNumber,
            amount: debitAmount,
            currency: selectedFromAccount.currency,
            description: 'Exchange currency',
            exchangeRate: chooseRate(selectedToAccount.currency)
        };

        setTransaction(newTransaction);
        setPaymentState('confirm');
    }

    function validForm() {
        return true;
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    function resetPaymentForm() {
        if (accounts.length > 0) {
            setSelectedFromAccount(accounts[0]);
        }
        if (accounts.length > 1) {
            setSelectedToAccount(accounts[1]);
        }
        setAmount(null);
        setDebitAmount(null);
        setConvertedAmount(null);
        setCurrencySelect(0);
    }

    return (
        <div>
        {
            loadContent && 
            <div>
                <h1 className="h2 mb-5 text-royal-blue fw-bold">Exchange money</h1>
                {
                    paymentState == 'start' &&
                    <div>
                        {
                            showError && <span className="text-danger mb-3">Show errors here.</span>
                        }
                        <form>
                            <h1 className="h4 mb-2 text-royal-blue fw-bold">From account</h1>
                            <Dropdown className="mb-3">
                                <Dropdown.Toggle id="dropdown-basic" className="select-field-account">
                                    {
                                        selectedFromAccount &&
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
                                    accounts.map(
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

                            <h1 className="h4 mb-2 text-royal-blue fw-bold">Amount to exchange</h1>
                            <div className="mb-3">
                                <input className="input-field" type="number" name="amount" placeholder="Amount" onChange={handleAmountChange} onKeyDown={checkAmountInput}/>
                                <select className="btn btn-royal-blue ms-3" name="currency" onChange={handleCurrencySelectChange} value={currencySelect}>
                                    { selectedFromAccount && <option value={selectedFromAccount.currency}>{selectedFromAccount.currency}</option> }
                                    { selectedToAccount && <option value={selectedToAccount.currency}>{selectedToAccount.currency}</option> }
                                </select>
                            </div>
                            <div className="mb-3">
                                <span>Exchange rate: </span>
                                <span className="account-balance">1 {selectedToAccount && selectedToAccount.currency} = {selectedFromAccount && <span>{chooseRate(selectedFromAccount.currency)} {selectedFromAccount.currency}</span>}</span>
                            </div>
                            {
                                amount &&
                                <span>
                                    <div className="mb-3">
                                        <span>Debit amount: </span>
                                        {amount && <span className="account-balance">{debitAmount} {selectedFromAccount.currency}</span>}
                                    </div>
                                    <div className="mb-3">
                                        <span>Converted amount: </span>
                                        <span className="account-balance">{convertedAmount} {selectedToAccount.currency}</span>
                                    </div>
                                </span>
                            }

                            <h1 className="h4 mb-2 text-royal-blue fw-bold">To account</h1>
                            <Dropdown className="mb-4">
                                <Dropdown.Toggle id="dropdown-basic" className="select-field-account">
                                { 
                                    selectedToAccount &&
                                    <div>
                                        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                            <span>{selectedToAccount.accountName}</span>
                                            <span className="account-balance">{selectedToAccount.balance.toLocaleString("de-DE")}</span>
                                        </div>
                                        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                            <span className="account-number">{selectedToAccount.accountNumber}</span>
                                            <span>{selectedToAccount.currency}</span>
                                        </div>
                                    </div>
                                }
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                {
                                    accounts.filter(account => selectedFromAccount && account.currency !== selectedFromAccount.currency)
                                        .map(
                                            account => (
                                                <Dropdown.Item className="select-field-account" key={account.accountNumber} onClick={() => handleSelectToAccountChange(account)}>
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

                            <div>
                                <button className="btn btn-royal-blue px-5 mb-3" type="button" name="submit" onClick={onSubmitForm}>Next</button>
                                <br/>
                                <button className="btn btn-secondary px-5" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                            </div>
                        </form>
                    </div>}

                {
                    paymentState == 'confirm' &&
                    <PaymentConfirmComponent paymentType='exchange' transaction={transaction} setPaymentState={setPaymentState} targetCurrency={selectedToAccount.currency}/>
                }
                {
                    paymentState == 'success' &&
                    <PaymentSuccessComponent amount={{value:convertedAmount, currency:selectedToAccount.currency}} destination={selectedToAccount.accountName} setPaymentState={setPaymentState} resetPaymentForm={resetPaymentForm}/>
                }
                {
                    paymentState == 'fail' &&
                    <PaymentFailureComponent setPaymentState={setPaymentState}/>
                }
            </div>
        }
        </div>
    );
}