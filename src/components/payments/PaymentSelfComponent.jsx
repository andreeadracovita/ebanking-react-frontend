import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useAuth } from "../security/AuthContext";
import { createTransactionApi, retrieveAllLocalBankAccountsForUsernameApi } from "../api/EBankingApiService";

const MAX_DESC_LENGTH = 20

export default function PaymentSelfComponent() {

    // enum state {
    //     start = 'start',
    //     confirm = 'confirm',
    //     success = 'success',
    //     fail = 'fail'
    // }

    const [loadContent, setLoadContent] = useState();

    const [paymentState, setPaymentState] = useState();

    const [accounts, setAccounts] = useState([]);

    const [selectedFromAccount, setSelectedFromAccount] = useState();

    const [selectedToAccount, setSelectedToAccount] = useState();

    const [amount, setAmount] = useState();

    const [description, setDescription] = useState('');

    const transactionDefault = {
        id: -1,
        fromAccountNumber: null,
        toAccountNumber: null,
        amount: 0,
        description: ''
    };

    const [transaction, setTransaction] = useState(transactionDefault);

    const authContext = useAuth();
    const username = authContext.username;
    const navigate = useNavigate();

    useEffect (() => refreshAccounts(), []); // once at page load

    useEffect (() => setValuesAfterAccountsLoad(), [accounts]); // catch accounts load

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
        if (selectedToAccount == null && accounts.length > 1) {
            setSelectedToAccount(accounts[1]);
        }
        setPaymentState('start');
        setLoadContent(true);
    }

    function handleSelectFromAccountChange(account) {
        const prevSelectedFromAccount = selectedFromAccount;
        setSelectedFromAccount(account);
        if (account == selectedToAccount) {
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

    function handleDescriptionChange(event) {
        if (event.target.value.length < MAX_DESC_LENGTH) {
            setDescription(event.target.value);
        }
    }

    // Handle button actions
    function onSubmitForm() {
        const newTransaction = {
            id: -1,
            fromAccountNumber: selectedFromAccount.accountNumber,
            toAccountNumber: selectedToAccount.accountNumber,
            amount: amount,
            description: description
        };

        setTransaction(newTransaction);
        setPaymentState('confirm');
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    function onConfirmForm() {
        createTransactionApi(username, transaction)
            .then(response => {
                console.log(response);
                setPaymentState('success');
            })
            .catch(error => {
                console.log(error);
                setPaymentState('fail');
            });
    }

    function onBack() {
        setPaymentState('start');
    }

    function onNewPaymentClicked() {
        if (accounts.length > 0) {
            setSelectedFromAccount(accounts[0]);
        }
        if (accounts.length > 1) {
            setSelectedToAccount(accounts[1]);
        }
        setAmount(null);
        setDescription(null);
        setPaymentState('start');
    }

    function onRetryPaymentClicked() {
        setPaymentState('start');
    }

    return (
        <div>
        { loadContent && 
            <div>
                <h1 className="h2 mb-5 text-royal-blue fw-bold">Send money to myself</h1>
                { paymentState == 'start' &&
                    <div>
                        <form>
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
                                    accounts.filter(account => selectedToAccount && account.accountNumber != selectedFromAccount.accountNumber)
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
                                    accounts.filter(account => selectedToAccount && account.accountNumber != selectedToAccount.accountNumber && account.accountNumber != selectedFromAccount.accountNumber)
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

                            <h1 className="h4 mb-2 text-royal-blue fw-bold">Transfer details</h1>

                            <div className="mb-3">
                                <input className="input-field" type="number" name="amount" placeholder="Amount" onChange={handleAmountChange} onKeyDown={checkAmountInput}/>
                            </div>
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

                {paymentState == 'confirm' &&
                    <div>
                        <div className="d-flex justify-content-center">
                            <div className="bg-light-royal-blue p-3 mb-3 text-left w-50">
                                <p>From account:</p>
                                <p className="ms-3 fw-bold">{transaction.fromAccountNumber}</p>
                                <br/>
                                <p>To account:</p>
                                <p className="ms-3 fw-bold">{transaction.toAccountNumber}</p>
                                <br/>
                                <p>Amount:</p>
                                <p className="ms-3 fw-bold">{transaction.amount} {selectedFromAccount.currency}</p>
                                <br/>
                                <p>Description:</p>
                                <p className="ms-3 fw-bold">{transaction.description}</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-royal-blue px-5 mb-3" type="button" name="confirm" onClick={onConfirmForm}>Sign</button>
                            <br/>
                            <button className="btn btn-secondary px-5" type="button" name="back" onClick={onBack}>Back</button>
                        </div>
                    </div>
                }
                {
                    paymentState == 'success' &&
                    <div className="text-center">
                        <div className="mb-5 fw-bold">
                            You transferred {transaction.amount} {selectedFromAccount.currency} to {selectedToAccount.accountName}.
                        </div>
                        <div>
                            <button className="btn btn-royal-blue px-5 mb-3" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                            <br/>
                            <button className="btn btn-secondary px-5" type="button" name="anotherPayment" onClick={onNewPaymentClicked}>Another payment</button>
                        </div>
                    </div>
                }
                {
                    paymentState == 'fail' &&
                    <div className="text-center">
                        <div className="mb-5 fw-bold">
                            Your transaction initiation failed.
                            <br/>
                            [Response reason.]
                        </div>
                        <div>
                            <button className="btn btn-royal-blue px-5 mb-3" type="button" name="anotherPayment" onClick={onRetryPaymentClicked}>Retry payment.</button>
                            <br/>
                            <button className="btn btn-royal-blue px-5" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                        </div>
                    </div>
                }
            </div>
        }
        </div>
    )
}