import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';

import { MAX_DESCRIPTION_LENGTH } from '../common/constants/Constants';
import { useAuth } from '../security/AuthContext';
import { retrieveAllLocalCheckingBankAccountsForUsernameApi } from '../api/EBankingApiService';
import PaymentConfirmComponent from './PaymentConfirmComponent';
import PaymentSuccessComponent from './PaymentSuccessComponent';
import PaymentFailureComponent from './PaymentFailureComponent';
import { checkAmountInput, processSum } from '../common/helpers/HelperFunctions';

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
        <div className="main-content">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Reimburse credit card</h1>
            {
                paymentState == 'start' &&
                <div>
                    {
                        showError &&
                        <div className="text-danger mb-5 fw-bold">
                            <p>Amount must be completed and larger than 0.</p>
                        </div>
                    }
                    <h1 className="h4 mb-3 text-royal-blue fw-bold">To account</h1>
                    <p className="mb-3 ms-3">{toAccount.accountName}</p>
                    <p className="mb-5 ms-3">{toAccount.accountNumber}</p>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div>
                            <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-5">
                                <InputLabel htmlFor="outlined-adornment-amount">{amountPlaceholder}</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    type='text'
                                    value={amount}
                                    onChange={handleAmountChange}
                                    onKeyDown={checkAmountInput}
                                    label={amountPlaceholder}
                                />
                            </FormControl>

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

                            <h1 className="h4 mb-3 text-royal-blue fw-bold">Transfer details (optional)</h1>
                            <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-4">
                                <InputLabel htmlFor="outlined-adornment-description">Description</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-description"
                                    type='text'
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    label="Description"
                                />
                            </FormControl>

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
                <PaymentConfirmComponent paymentType='self' transaction={transaction} setPaymentState={setPaymentState} />
            }
            {
                paymentState == 'success' &&
                <PaymentSuccessComponent amount={{value:transaction.amount, currency:transaction.currency}} destination={location.state.account.accountName} setPaymentState={setPaymentState} />
            }
            {
                paymentState == 'fail' &&
                <PaymentFailureComponent setPaymentState={setPaymentState} />
            }
        </div>
    );
}