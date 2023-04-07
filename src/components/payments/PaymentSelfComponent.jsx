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

    const [paymentState, setPaymentState] = useState('start')

    const [accounts, setAccounts] = useState([])

    const [selectedFromAccount, setSelectedFromAccount] = useState()

    const [selectedToAccount, setSelectedToAccount] = useState()

    const [amount, setAmount] = useState()

    const [description, setDescription] = useState();

    const authContext = useAuth()
    const username = authContext.username
    const navigate = useNavigate()

    useEffect (() => refreshPage(), [])

    var transaction = {
        id: -1,
        fromAccountNumber: null,
        toAccountNumber: null,
        amount: 0,
        description: ''
    }

    function refreshPage() {
        setPaymentState('start');

        retrieveAllLocalBankAccountsForUsernameApi(username)
            .then(response => {
                setAccounts(response.data)
                if (accounts.length > 0) {
                    setSelectedFromAccount(accounts[0])
                }
                if (accounts.length > 1) {
                    setSelectedToAccount(accounts[1])
                }
            })
            .catch(error => console.log(error))
    }

    function handleSelectFromAccountChange(accountNumber) {
        setSelectedFromAccount(accountNumber)
    }

    function handleSelectToAccountChange(accountNumber) {
        setSelectedToAccount(accountNumber)
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
            event.preventDefault()
            return
        }

        setAmount(event.target.value)
    }

    function handleDescriptionChange(event) {
        if (event.target.value.length < MAX_DESC_LENGTH) {
            setDescription(event.target.value)
        }
    }

    // Handle button actions
    function onSubmitForm() {
        transaction = {
            id: -1,
            fromAccountNumber: selectedFromAccount.accountNumber.value,
            toAccountNumber: selectedToAccount.accountNumber.value,
            amount: amount.value,
            description: description.value
        }

        setPaymentState('confirm')
    }

    function onPortfolioRedirect() {
        navigate('/portfolio')
    }

    function onConfirmForm() {
        console.log('Transaction:')
        console.log(transaction)

        createTransactionApi(username, transaction)
            .then(response => {
                console.log(response)
                setPaymentState('success')
            })
            .catch(error => {
                console.log(error)
                setPaymentState('fail')
            })
    }

    function onBack() {
        setPaymentState('start')
    }

    function onNewPaymentClicked() {
        if (accounts.length > 0) {
            setSelectedFromAccount(accounts[0])
        }
        if (accounts.length > 1) {
            setSelectedToAccount(accounts[1])
        }
        setAmount(null)
        setDescription(null)
        setPaymentState('start')
    }

    function onRetryPaymentClicked() {
        setPaymentState('start')
    }

    return (
        <div>
            { paymentState == 'start' &&
                <div>
                    <h1 className="h2 mb-5 text-royal-blue fw-bold">Send money to myself</h1>
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
                                    accounts.filter(account => selectedToAccount && account.accountNumber != selectedToAccount.accountNumber && account.accountNumber != selectedFromAccount.accountNumber)
                                        .map(
                                            account => (
                                                <Dropdown.Item className="select-field-account" key={account.accountNumber} onClick={(account) => handleSelectFromAccountChange(account)}>
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
                                { selectedToAccount &&
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
                                                <Dropdown.Item className="select-field-account" key={account.accountNumber} onClick={(account) => handleSelectToAccountChange(account)}>
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
                            <input className="input-field" type="text" name="description" placeholder="Description" onChange={handleDescriptionChange} />
                        </div>

                        <div>
                            <button className="btn btn-royal-blue px-5 mb-3" type="button" name="submit" onClick={onSubmitForm}>Next</button>
                            <br/>
                            <button className="btn btn-royal-blue px-5" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                        </div>
                    </form>
                </div>}
            {paymentState == 'confirm' &&
                <div>
                    <div>
                        List completed fields.
                    </div>
                    <div>
                        <button className="btn btn-royal-blue px-5 mb-3" type="button" name="confirm" onClick={onConfirmForm}>Sign</button>
                        <br/>
                        <button className="btn btn-royal-blue px-5" type="button" name="back" onClick={onBack}>Back</button>
                    </div>
                </div>}
            {paymentState == 'success' &&
                <div>
                    <div>
                        Success.
                    </div>
                    <div>
                        <button className="btn btn-royal-blue px-5 mb-3" type="button" name="anotherPayment" onClick={onNewPaymentClicked}>Another payment</button>
                        <br/>
                        <button className="btn btn-royal-blue px-5" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                    </div>
                </div>}
            {paymentState == 'fail' &&
                <div>
                    <div>
                        Your transaction initiation failed.
                        <br/>
                        Response reason.
                    </div>
                    <div>
                        <button className="btn btn-royal-blue px-5 mb-3" type="button" name="anotherPayment" onClick={onRetryPaymentClicked}>Retry payment.</button>
                        <br/>
                        <button className="btn btn-royal-blue px-5" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                    </div>
                </div>}
        </div>
    )
}