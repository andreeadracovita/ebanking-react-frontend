import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import SplineChartComponent from "./SplineChartComponent";
import { retrieveAllBankAccountsForUsernameApi, retrieveAllTransactionsForBankAccountNumberApi } from "./api/EBankingApiService";
import { useAuth } from "./security/AuthContext";

export default function ReportsComponent() {

    const [accounts, setAccounts] = useState([])

    const [transactions, setTransactions] = useState([])

    const [selectedAccount, setSelectedAccount] = useState()

    useEffect (() => refreshAccounts(), [])

    const authContext = useAuth()
    const username = authContext.username

    function refreshAccounts() {
        retrieveAllBankAccountsForUsernameApi(username)
            .then(response => {
                setAccounts(response.data)
                if (accounts.length > 0) {
                    setSelectedAccount(accounts[0])
                }
            })
            .catch(error => console.log(error))
    }

    function refreshTransactions(account) {
        retrieveAllTransactionsForBankAccountNumberApi(username, account)
            .then(response => {
                setTransactions(response.data)
            })
            .catch(error => console.log(error))
    }

    function handleSelectedAccountChange(account) {
        setSelectedAccount(account)
        refreshTransactions(selectedAccount)
    }

    return (
        <div>
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Reports</h1>
            <Dropdown className="mb-5">
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
                        </div>
                    }
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        accounts.filter(account => selectedAccount && account.accountNumber != selectedAccount.accountNumber)
                            .map(
                                account => (
                                    <Dropdown.Item className="select-field-account" key={account.accountNumber} onClick={(account) => handleSelectedAccountChange(account)}>
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
            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <tbody>
                        {
                            transactions.map(
                                transaction => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.date.toString()}</td>
                                        {transaction.fromAccountNumber == selectedAccount && 
                                            <td className="text-danger">-{transaction.amount}</td>
                                        }
                                        {transaction.fromAccountNumber != selectedAccount && 
                                            <td className="text-success">+{transaction.amount}</td>
                                        }
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
            <SplineChartComponent/>
        </div>
    )
}