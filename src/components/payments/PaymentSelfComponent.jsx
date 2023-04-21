import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';

import { useAuth } from '../security/AuthContext';
import { retrieveAllLocalBankAccountsForUsernameApi } from '../api/EBankingApiService';
import PaymentConfirmComponent from './PaymentConfirmComponent';
import PaymentSuccessComponent from './PaymentSuccessComponent';
import PaymentFailureComponent from './PaymentFailureComponent';
import { MAX_DESCRIPTION_LENGTH } from '../common/constants/Constants';
import { checkAmountInput, processSum } from '../common/helpers/HelperFunctions';

export default function PaymentSelfComponent() {
    // PaymentState { 'start', 'confirm', 'success', 'fail' }

    const [loadContent, setLoadContent] = useState();
    const [paymentState, setPaymentState] = useState();

    const [accounts, setAccounts] = useState([]);
    const [selectedFromAccount, setSelectedFromAccount] = useState();
    const [selectedToAccount, setSelectedToAccount] = useState();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

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
    useEffect (() => setValuesAfterAccountsLoad(), [accounts]); // catch accounts load
    useEffect (() => initPage(), [selectedFromAccount, selectedToAccount]); // catch selected accounts load

    function refreshAccounts() {
        retrieveAllLocalBankAccountsForUsernameApi(username)
            .then(response => {
                setAccounts(response.data);
            })
            .catch(error => console.log(error));
    }

    function setValuesAfterAccountsLoad() {
        if (selectedFromAccount == null && accounts.length > 0) {
            setSelectedFromAccount(accounts[0]);
        }

        if (selectedToAccount == null) {
            if (location && location.state && location.state.toAccount) {
                setSelectedToAccount(location.state.toAccount);
            } else if (accounts.length > 1) {
                setSelectedToAccount(accounts[1]);
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
        if (account.accountNumber === selectedToAccount.accountNumber) {
            setSelectedToAccount(prevSelectedFromAccount);
        }
    }

    function handleSelectToAccountChange(account) {
        setSelectedToAccount(account);
    }

    function handleAmountChange(event) {
        processSum(event, setAmount);
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
            toAccountNumber: selectedToAccount.accountNumber,
            amount: Number(amount),
            currency: selectedFromAccount.currency,
            description: description,
            exchangeRate: 1.0
        };

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

    function resetPaymentForm() {
        if (accounts.length > 0) {
            setSelectedFromAccount(accounts[0]);
        }
        if (accounts.length > 1) {
            setSelectedToAccount(accounts[1]);
        }
        setAmount(null);
        setDescription(null);
    }

    return (
        <div>
        { loadContent && 
            <div>
                <h1 className="h2 mb-5 text-royal-blue fw-bold">Send money to myself</h1>
                { paymentState == 'start' &&
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
                                        { selectedFromAccount &&
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
                                                    <Dropdown.Item className="select-field-account" key={account.accountNumber} onClick={() => handleSelectFromAccountChange(account)}>
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

                                <h1 className="h4 mb-3 text-royal-blue fw-bold">To account</h1>
                                <Dropdown className="mb-5">
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
                                        accounts.filter(account => selectedToAccount && selectedFromAccount && account.accountNumber != selectedToAccount.accountNumber && account.accountNumber != selectedFromAccount.accountNumber)
                                            .map(
                                                account => (
                                                    <Dropdown.Item className="select-field-account" key={account.accountNumber} onClick={() => handleSelectToAccountChange(account)}>
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

                                <h1 className="h4 mb-3 text-royal-blue fw-bold">Transfer details</h1>
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
                                <br/>
                                <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-5">
                                    <InputLabel htmlFor="outlined-adornment-description">Description</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-description"
                                        type='text'
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        label="Description"
                                    />
                                </FormControl>
                                <br/>
                                <button className="btn btn-royal-blue btn-form mb-3" type="button" name="submit" onClick={onSubmitForm}>Next</button>
                                <br/>
                                <button className="btn btn-secondary btn-form" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                            </div>
                        </Box>
                    </div>}

                {
                    paymentState == 'confirm' &&
                    <PaymentConfirmComponent paymentType='self' transaction={transaction} setPaymentState={setPaymentState}/>
                }
                {
                    paymentState == 'success' &&
                    <PaymentSuccessComponent amount={{value:transaction.amount, currency:transaction.currency}} destination={selectedToAccount.accountName} setPaymentState={setPaymentState} resetPaymentForm={resetPaymentForm}/>
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