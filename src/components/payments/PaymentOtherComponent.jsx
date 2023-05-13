import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Dropdown } from 'react-bootstrap';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';

import { createTransactionApi, retrieveCheckingAccountsForUsernameApi } from '../api/EBankingApiService';
import { useAuth } from '../security/AuthContext';
import PaymentConfirmComponent from './PaymentConfirmComponent';
import PaymentSuccessComponent from './PaymentSuccessComponent';
import PaymentFailureComponent from './PaymentFailureComponent';
import { ACCOUNT_NUMBER_LENGTH, ComponentState, ErrorMessage, MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from '../common/constants/Constants';
import { CHFCurrency, checkAmountInput, processSum } from '../common/helpers/HelperFunctions';

export default function PaymentOtherComponent() {
    const [componentState, setComponentState] = useState(ComponentState.start);

    const [accounts, setAccounts] = useState([]);
    const [selectedFromAccount, setSelectedFromAccount] = useState();
    const [toAccountNumber, setToAccountNumber] = useState('');
    const [beneficiaryName, setBeneficiaryName] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const errorFields = {
        fromAccount: false,
        toAccount: false,
        beneficiaryName: false,
        amount: false
    }
    const [showError, setShowError] = useState(errorFields);

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
    const [responseErrorMessage, setResponseErrorMessage] = useState('');

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect (() => {
        refreshAccounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect (() => {
        setValuesAfterAccountsLoad();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accounts]);

    function refreshAccounts() {
        retrieveCheckingAccountsForUsernameApi(username)
            .then(response => {
                setAccounts(response.data);
            })
            .catch();
    }

    function setValuesAfterAccountsLoad() {
        if (selectedFromAccount === undefined) {
            if (location && location.state && location.state.fromAccount) {
                setSelectedFromAccount(location.state.fromAccount);
            } else if (accounts.length > 0) {
                setSelectedFromAccount(accounts[0]);
            }
        }
    }

    function handleSelectFromAccountChange(account) {
        setSelectedFromAccount(account);
    }

    function handleToAccountNumberChange(event) {
        if (event.target.value.length <= ACCOUNT_NUMBER_LENGTH) {
            setToAccountNumber(event.target.value);
        }
    }

    function handleBeneficiaryNameChange(event) {
        if (event.target.value.length <= MAX_NAME_LENGTH) {
            setBeneficiaryName(event.target.value);
        }
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
            toAccountNumber: toAccountNumber,
            beneficiaryName: beneficiaryName,
            amount: amount,
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

        setShowError(prevValue => ({...prevValue, toAccount: (toAccountNumber === '' || toAccountNumber.length !== ACCOUNT_NUMBER_LENGTH)}));
        valid = valid && toAccountNumber !== '' && toAccountNumber.length === ACCOUNT_NUMBER_LENGTH;

        setShowError(prevValue => ({...prevValue, beneficiaryName: beneficiaryName === '' || beneficiaryName.length > MAX_NAME_LENGTH}));
        valid = valid && beneficiaryName !== '' && beneficiaryName.length <= MAX_NAME_LENGTH;

        setShowError(prevValue => ({...prevValue, amount: (amount === '' || Number(amount) === 0)}));
        valid = valid && amount !== '' && Number(amount) !== 0;

        return valid;
    }

    function onConfirmForm() {
        createTransactionApi(username, "payment", transaction)
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
        setToAccountNumber('');
        setBeneficiaryName('');
        setAmount('');
        setDescription('');
        setComponentState(ComponentState.start);
    }

    return (
        <div className="main-content">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Send money to someone else</h1>
            {
                componentState === ComponentState.start &&
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
                                                <span className="account-balance">{CHFCurrency.format(selectedFromAccount.balance)}</span>
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
                                                            <span className="account-balance">{CHFCurrency.format(account.balance)}</span>
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

                            <h1 className="h4 mb-3 text-royal-blue fw-bold">Beneficiary</h1>
                            {
                                showError.toAccount &&
                                <span className="text-danger mb-3">
                                    <p>{ErrorMessage.beneficiaryAccount}</p>
                                </span>
                            }
                            <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-4">
                                <InputLabel htmlFor="outlined-adornment-account">Account number</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-account"
                                    type='text'
                                    value={toAccountNumber}
                                    onChange={handleToAccountNumberChange}
                                    label="Account number"
                                />
                            </FormControl>
                            <br/>
                            {
                                showError.beneficiaryName &&
                                <span className="text-danger mb-3">
                                    <p>{ErrorMessage.beneficiaryName}</p>
                                </span>
                            }
                            <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-5">
                                <InputLabel htmlFor="outlined-adornment-name">Name</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-name"
                                    type='text'
                                    value={beneficiaryName}
                                    onChange={handleBeneficiaryNameChange}
                                    label="Name"
                                />
                            </FormControl>

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
                <PaymentConfirmComponent paymentType='other' transaction={transaction} setComponentState={setComponentState} onConfirmForm={onConfirmForm} />
            }
            {
                componentState === ComponentState.success &&
                <PaymentSuccessComponent amount={{value:transaction.amount, currency:transaction.currency}} destination={transaction.beneficiaryName} setComponentState={setComponentState} resetPaymentForm={resetPaymentForm} refreshAccounts={refreshAccounts} />
            }
            {
                componentState === ComponentState.failure &&
                <PaymentFailureComponent setComponentState={setComponentState} message={responseErrorMessage} />
            }
        </div>
    );
}