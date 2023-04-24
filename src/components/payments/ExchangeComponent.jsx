import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Dropdown } from 'react-bootstrap';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';

import { useAuth } from '../security/AuthContext';
import PaymentConfirmComponent from './PaymentConfirmComponent';
import PaymentSuccessComponent from './PaymentSuccessComponent';
import PaymentFailureComponent from './PaymentFailureComponent';
import { retrieveCheckingAccountsForUsernameApi } from '../api/EBankingApiService';
import { checkAmountInput, processSum } from '../common/helpers/HelperFunctions';

// Reference currency: CHF
const exchangeRate = {
    CHF:  1,
    EUR: 0.9,
    USD: 0.8
};

export default function ExchangeComponent() {
    // PaymentState { 'start', 'confirm', 'success', 'fail' }

    const [paymentState, setPaymentState] = useState();

    const [accounts, setAccounts] = useState([]);
    const [targetAccounts, setTargetAccounts] = useState([]);
    const [selectedFromAccount, setSelectedFromAccount] = useState();
    const [selectedToAccount, setSelectedToAccount] = useState();
    const [amount, setAmount] = useState();
    const [debitAmount, setDebitAmount] = useState();
    const [convertedAmount, setConvertedAmount] = useState();
    const [currencySelect, setCurrencySelect] = useState();
    const [targetCurrency, setTargetCurrency] = useState('CHF');

    const referenceCurrency = 'CHF';

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
    const location = useLocation();

    useEffect (() => refreshAccounts(), []); // once at page load
    useEffect (() => setFromAccountAfterAccountsLoad(), [accounts]); // catch accounts load
    useEffect (() => setToAccountAfterFromAccountLoad(), [selectedFromAccount]); // catch from account load
    useEffect (() => computeTarget(), [selectedFromAccount, selectedToAccount]); // catch selected accounts load
    useEffect (() => initPage(), [targetCurrency]); // render page after all loads
    useEffect (() => recomputeTransactionAmounts(), [selectedFromAccount, selectedToAccount, amount, currencySelect, targetCurrency]);

    function refreshAccounts() {
        retrieveCheckingAccountsForUsernameApi(username)
            .then(response => {
                setAccounts(response.data);
            })
            .catch(error => console.log(error));
    }

    function setFromAccountAfterAccountsLoad() {
        if (selectedFromAccount == null) {
            if (location && location.state && location.state.fromAccount) {
                setSelectedFromAccount(location.state.fromAccount);
                setCurrencySelect(location.state.fromAccount.currency);
            } else if (accounts.length > 0) {
                setSelectedFromAccount(accounts[0]);
                setCurrencySelect(accounts[0].currency);
            }
        }
    }

    function setToAccountAfterFromAccountLoad() {
        if (selectedFromAccount && currencySelect && accounts.length > 0) {
            let targetCurrencyAccounts = [];
            if (selectedFromAccount.currency == 'CHF') {
                targetCurrencyAccounts = accounts.filter(account => account.currency !== 'CHF');
            } else {
                targetCurrencyAccounts = accounts.filter(account => account.currency === 'CHF');
            }
            if (selectedToAccount == null && targetCurrencyAccounts.length > 0) {
                setSelectedToAccount(targetCurrencyAccounts[0]);
            }
            setTargetAccounts(targetCurrencyAccounts);
        }
    }

    function computeTarget() {
        if (selectedFromAccount && selectedFromAccount.currency != 'CHF') {
            setTargetCurrency(selectedFromAccount.currency);
        } else if (selectedToAccount) {
            setTargetCurrency(selectedToAccount.currency);
        }
    }

    function initPage() {
        if (selectedFromAccount && selectedToAccount && targetCurrency) {
            setPaymentState('start');
        }
    }

    function handleSelectFromAccountChange(account) {
        const prevSelectedFromAccount = selectedFromAccount;
        setSelectedFromAccount(account);
        if (account.accountNumber == selectedToAccount.accountNumber) {
            setSelectedToAccount(prevSelectedFromAccount);
            return;
        }
        setToAccountAfterFromAccountLoad();
    }

    function handleSelectToAccountChange(account) {
        setSelectedToAccount(account);
    }

    function handleAmountChange(event) {
        processSum(event, setAmount);
    }

    function recomputeTransactionAmounts() {
        if  (selectedFromAccount && selectedToAccount) {
            if (currencySelect == selectedFromAccount.currency) {
                setDebitAmount(amount);
                if (selectedFromAccount.currency == referenceCurrency) {
                    setConvertedAmount((amount / exchangeRate[selectedToAccount.currency]).toFixed(2));
                } else {
                    setConvertedAmount((amount * exchangeRate[targetCurrency]).toFixed(2));
                }
            } else {
                if (selectedFromAccount.currency == referenceCurrency) {
                    setDebitAmount((amount * exchangeRate[targetCurrency]).toFixed(2));
                } else {
                    setDebitAmount((amount / exchangeRate[targetCurrency]).toFixed(2));
                }
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
            exchangeRate: 1 / exchangeRate[selectedToAccount.currency]
        };

        console.log(newTransaction);

        setTransaction(newTransaction);
        setPaymentState('confirm');
    }

    function validForm() {
        if (amount === '' || Number(amount) === 0) {
            return false;
        }
        return true;
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    return (
        <div className="main-content">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Exchange money</h1>
            {
                paymentState == 'start' &&
                <div>
                    {
                        showError && 
                        <span className="text-danger mb-5">
                            <p>Amount must be completed and larger than 0.</p>
                        </span>
                    }
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div>
                            <h1 className="h4 mb-3 text-royal-blue fw-bold">From account</h1>
                            <Dropdown className="mb-5">
                                <Dropdown.Toggle id="dropdown-basic" className="select-field-account">
                                    {
                                        selectedFromAccount &&
                                        <div>
                                            <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                <span>{selectedFromAccount.accountName}</span>
                                                <span className="account-balance">{selectedFromAccount.balance.toLocaleString("de-CH")}</span>
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
                                                <Dropdown.Item className="select-dropdown" key={account.accountNumber} onClick={() => handleSelectFromAccountChange(account)}>
                                                    <div>
                                                        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                            <span>{account.accountName}</span>
                                                            <span className="account-balance">{account.balance.toLocaleString("de-CH")}</span>
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

                            <h1 className="h4 mb-3 text-royal-blue fw-bold">Amount to exchange</h1>
                            <div className="">
                                <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-4">
                                    <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        type='text'
                                        value={amount}
                                        onChange={handleAmountChange}
                                        onKeyDown={checkAmountInput}
                                        label="Amount"
                                    />
                                </FormControl>
                                <select className="btn btn-royal-blue ms-3" style={{height: 54+'px', width: 94+'px'}} name="currency" onChange={handleCurrencySelectChange} value={currencySelect}>
                                    { selectedFromAccount && <option value={selectedFromAccount.currency}>{selectedFromAccount.currency}</option> }
                                    { selectedToAccount && <option value={selectedToAccount.currency}>{selectedToAccount.currency}</option> }
                                </select>
                            </div>
                            <div className="mb-3">
                                <span>Exchange rate: </span>
                                <span className="account-balance">1 {targetCurrency} = {(exchangeRate[targetCurrency]).toFixed(4)} {referenceCurrency}</span>
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
                                            <span className="account-balance">{selectedToAccount.balance.toLocaleString("de-CH")}</span>
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
                                    targetAccounts.filter(account => selectedToAccount && account.accountNumber !== selectedToAccount.accountNumber)
                                        .map(
                                            account => (
                                                <Dropdown.Item className="select-dropdown" key={account.accountNumber} onClick={() => handleSelectToAccountChange(account)}>
                                                    <div>
                                                        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                            <span>{account.accountName}</span>
                                                            <span className="account-balance">{account.balance.toLocaleString("de-CH")}</span>
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
                                <button className="btn btn-royal-blue btn-form mb-3" type="button" name="submit" onClick={onSubmitForm}>Next</button>
                                <br/>
                                <button className="btn btn-secondary btn-form" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                            </div>
                        </div>
                    </Box>
                </div>}

            {
                paymentState == 'confirm' &&
                <PaymentConfirmComponent paymentType='exchange' transaction={transaction} setPaymentState={setPaymentState} targetCurrency={selectedToAccount.currency} />
            }
            {
                paymentState == 'success' &&
                <PaymentSuccessComponent amount={{value:convertedAmount, currency:selectedToAccount.currency}} destination={selectedToAccount.accountName} setPaymentState={setPaymentState} />
            }
            {
                paymentState == 'fail' &&
                <PaymentFailureComponent setPaymentState={setPaymentState} />
            }
        </div>
    );
}