import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';

import { useAuth } from '../security/AuthContext';
import { createTransactionApi, retrieveAllLocalBankAccountsForUsernameApi } from '../api/EBankingApiService';
import PaymentConfirmComponent from './PaymentConfirmComponent';
import PaymentSuccessComponent from './PaymentSuccessComponent';
import PaymentFailureComponent from './PaymentFailureComponent';
import { ComponentState, ErrorMessage, MAX_DESCRIPTION_LENGTH } from '../common/constants/Constants';
import { checkAmountInput, processSum } from '../common/helpers/HelperFunctions';

export default function PaymentSelfComponent() {
    const [componentState, setComponentState] = useState(ComponentState.start);

    const [accounts, setAccounts] = useState([]);
    const [selectedFromAccount, setSelectedFromAccount] = useState();
    const [selectedToAccount, setSelectedToAccount] = useState();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const errorFields = {
        fromAccount: false,
        toAccount: false,
        amount: false
    }
    const [showError, setShowError] = useState(errorFields);

    const [responseErrorMessage, setResponseErrorMessage] = useState('');

    const transactionDefault = {
        id: -1,
        fromAccountNumber: undefined,
        toAccountNumber: undefined,
        beneficiaryName: undefined,
        amount: 0,
        currency: 0,
        description: ''
    };

    const [transaction, setTransaction] = useState(transactionDefault);

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect (() => {
        refreshAccounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect (() => {
        if (selectedFromAccount !== undefined && selectedToAccount !== undefined) {
            setSelectedFromAccount(findAccountWithNumber(selectedFromAccount.accountNumber));
            setSelectedToAccount(findAccountWithNumber(selectedToAccount.accountNumber));
        }

        if (selectedFromAccount === undefined && accounts.length > 0) {
            setSelectedFromAccount(accounts[0]);
        }

        if (selectedToAccount === undefined) {
            if (location && location.state && location.state.toAccount) {
                setSelectedToAccount(location.state.toAccount);
            } else if (accounts.length > 1) {
                setSelectedToAccount(accounts[1]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accounts]);

    function refreshAccounts() {
        retrieveAllLocalBankAccountsForUsernameApi(username)
            .then(response => {
                setAccounts(response.data);
            })
            .catch(error => console.log(error));
    }

    function findAccountWithNumber(accountNumber) {
        return accounts.filter((account) => account.accountNumber === accountNumber)[0];
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

    function onSubmitForm() {
        if (!validForm()) {
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
        setComponentState(ComponentState.confirm);
    }

    function validForm() {
        var valid = true;

        setShowError(prevValue => ({...prevValue, fromAccount: !selectedFromAccount}));
        valid = valid && selectedFromAccount !== undefined;

        setShowError(prevValue => ({...prevValue, toAccount: !selectedToAccount}));
        valid = valid && selectedToAccount !== undefined;

        setShowError(prevValue => ({...prevValue, amount: (amount === '' || Number(amount) === 0)}));
        valid = valid && amount !== '' && Number(amount) !== 0;

        return valid;
    }

    function onConfirmForm() {
        createTransactionApi(username, transaction)
            .then(() => {
                setComponentState(ComponentState.success);
            })
            .catch(error => {
                setResponseErrorMessage(error.response.data);
                setComponentState(ComponentState.failure);
            });
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    function resetPaymentForm() {
        setAmount(null);
        setDescription(null);
        setComponentState(ComponentState.start);
    }

    return (
        <div className="main-content">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Send money to myself</h1>
            {
                componentState === 'start' &&
                <div>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div>
                            <h1 className="h4 mb-3 text-royal-blue fw-bold">From account</h1>
                            {
                                showError.fromAccount &&
                                <span className="text-danger mb-3">
                                    <p>{ErrorMessage.noAccountSelected}</p>
                                </span>
                            }
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
                                    accounts &&
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

                            <h1 className="h4 mb-3 text-royal-blue fw-bold">To account</h1>
                            {
                                showError.toAccount &&
                                <span className="text-danger mb-3">
                                    <p>{ErrorMessage.noAccountSelected}</p>
                                </span>
                            }
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
                                    selectedToAccount && selectedFromAccount && accounts &&
                                    accounts.filter(account => selectedToAccount && selectedFromAccount && account.accountNumber !== selectedToAccount.accountNumber && account.accountNumber !== selectedFromAccount.accountNumber)
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

                            <h1 className="h4 mb-3 text-royal-blue fw-bold">Transfer details</h1>
                            {
                                showError.amount &&
                                <span className="text-danger mb-3">
                                    <p>{ErrorMessage.amount}</p>
                                </span>
                            }
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
                </div>
            }
            {
                componentState === ComponentState.confirm &&
                <PaymentConfirmComponent paymentType='self' transaction={transaction} setComponentState={setComponentState} onConfirmForm={onConfirmForm}/>
            }
            {
                componentState === ComponentState.success &&
                <PaymentSuccessComponent amount={{value:transaction.amount, currency:transaction.currency}} destination={selectedToAccount.accountName} setComponentState={setComponentState} resetPaymentForm={resetPaymentForm} refreshAccounts={refreshAccounts} />
            }
            {
                componentState === ComponentState.failure &&
                <PaymentFailureComponent setComponentState={setComponentState} message={responseErrorMessage} />
            }
        </div>
    );
}