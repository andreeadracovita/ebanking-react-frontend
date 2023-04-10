import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import SplineChartComponent from "./SplineChartComponent";
import { retrieveAllBankAccountsForUsernameApi, retrieveAllTransactionsForBankAccountNumberApi } from "./api/EBankingApiService";
import { useAuth } from "./security/AuthContext";

export default function ReportsComponent() {

    const [accounts, setAccounts] = useState([])

    const [transactions, setTransactions] = useState([])

    const [selectedAccount, setSelectedAccount] = useState(null)

    const [loadContent, setLoadContent] = useState()

    useEffect (() => refreshAccounts(), [])
    useEffect (() => refreshTransactions(), [selectedAccount])
    useEffect (() => setLoadContent(true), [transactions])

    const authContext = useAuth()
    const username = authContext.username

    function refreshAccounts() {
        retrieveAllBankAccountsForUsernameApi(username)
            .then(response => {
                setAccounts(response.data)
                if (selectedAccount == null && accounts.length > 0) {
                    setSelectedAccount(response.data[0])
                }
            })
            .catch(error => console.log(error))
    }

    function refreshTransactions() {
        if (selectedAccount != null) {
            retrieveAllTransactionsForBankAccountNumberApi(username, selectedAccount.accountNumber)
            .then(response => {
                setTransactions(response.data)
            })
            .catch(error => console.log(error))
        }
    }

    function handleSelectedAccountChange(account) {
        setSelectedAccount(account)
        refreshTransactions()
    }

    return (
        <div>
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Reports</h1>
            { loadContent &&
                <span>
                    <Dropdown className="mb-4">
                        <Dropdown.Toggle id="dropdown-basic" className="select-field-account">
                            { selectedAccount &&
                                <div>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span>{selectedAccount.accountName}</span>
                                        <span className="account-balance">{selectedAccount.balance.toLocaleString("de-DE")}</span>
                                    </div>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span className="account-number">{selectedAccount.accountNumber}</span>
                                        <span>{selectedAccount.currency}</span>
                                    </div>
                                </div>}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {
                                accounts.map(
                                        account => (
                                            <Dropdown.Item className="select-field-account" key={account.accountNumber} onClick={() => handleSelectedAccountChange(account)}>
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
                    {
                        transactions.map(
                            transaction => (
                                <span>
                                    <div className="row">
                                        <div className="col-1">{transaction.issueDate.toString()}</div>
                                        <div className="col-11">
                                            { transaction.fromAccountNumber == selectedAccount.accountNumber && 
                                                <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                    <span>{transaction.toAccountNumber}</span>
                                                    <span className="text-danger fw-bold">-{transaction.amount}</span>
                                                </div>
                                            }
                                            { transaction.toAccountNumber == selectedAccount.accountNumber && 
                                                <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                    <span>{transaction.fromAccountNumber}</span>
                                                    <span className="text-success fw-bold">+{transaction.amount}</span>
                                                </div>
                                            }
                                            <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                <span className="account-number">
                                                    { transaction.fromAccountNumber == selectedAccount.accountNumber && 
                                                        <span>Outgoing</span>
                                                    }
                                                    { transaction.toAccountNumber == selectedAccount.accountNumber && 
                                                        <span>Incoming</span>
                                                    }
                                                </span>
                                                <span>{selectedAccount.currency}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                </span>
                            )
                        )
                    }
                    </div>
                </span>}
            {/* <SplineChartComponent/> */}
        </div>
    )
}