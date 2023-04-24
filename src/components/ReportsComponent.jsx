import { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useLocation } from 'react-router';

import { retrieveAllBankAccountsForUsernameApi, retrieveAllTransactionsForBankAccountNumberApi } from './api/EBankingApiService';
import { useAuth } from './security/AuthContext';

export default function ReportsComponent() {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loadContent, setLoadContent] = useState();

    useEffect (() => refreshAccounts(), []);
    useEffect (() => setValuesAfterAccountsLoad(), [accounts]);
    useEffect (() => refreshTransactions(), [selectedAccount]);
    useEffect (() => initPage(), [transactions]);

    const location = useLocation();

    const authContext = useAuth();
    const username = authContext.username;

    function refreshAccounts() {
        retrieveAllBankAccountsForUsernameApi(username)
            .then(response => {
                setAccounts(response.data);
            })
            .catch(error => console.log(error));
    }

    function setValuesAfterAccountsLoad() {
        if (location && location.state && location.state.account) {
            setSelectedAccount(location.state.account);
            return;
        }

        if (selectedAccount == null && accounts.length > 0) {
            setSelectedAccount(accounts[0]);
        }
    }

    function initPage() {
        setLoadContent(true);
    }

    function refreshTransactions() {
        if (selectedAccount != null) {
            retrieveAllTransactionsForBankAccountNumberApi(username, selectedAccount.accountNumber)
                .then(response => {
                    setTransactions(response.data);
                })
                .catch(error => console.log(error));
        }
    }

    function handleSelectedAccountChange(account) {
        setSelectedAccount(account);
        refreshTransactions();
    }

    return (
        <div className="col-8">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Reports</h1>
            { 
                loadContent &&
                <span>
                    <Dropdown className="mb-4">
                        <Dropdown.Toggle id="dropdown-basic" className="select-field-account">
                            { selectedAccount &&
                                <div>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span>{selectedAccount.accountName}</span>
                                        <span className="account-balance">{selectedAccount.balance.toLocaleString("de-CH")}</span>
                                    </div>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span className="account-number small">{selectedAccount.accountNumber}</span>
                                        <span className="small">{selectedAccount.currency}</span>
                                    </div>
                                </div>}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {
                                accounts.map(
                                        account => (
                                            <Dropdown.Item className="select-dropdown" key={account.accountNumber} onClick={() => handleSelectedAccountChange(account)}>
                                                <div>
                                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                        <span>{account.accountName}</span>
                                                        <span className="account-balance">{account.balance.toLocaleString("de-CH")}</span>
                                                    </div>
                                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                        <span className="account-number small">{account.accountNumber}</span>
                                                        <span className="small">{account.currency}</span>
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
                                <span key={transaction.id}>
                                    <div className="row">
                                        <div className="col-1">{transaction.issueDate.toString()}</div>
                                        <div className="col-11">
                                            { transaction.fromAccountNumber == selectedAccount.accountNumber && 
                                                <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                    <span>{transaction.toAccountNumber}</span>
                                                    <span className="text-danger fw-bold">-{(transaction.amount).toLocaleString("de-CH")}</span>
                                                </div>
                                            }
                                            { transaction.toAccountNumber == selectedAccount.accountNumber && 
                                                <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                    <span>{transaction.fromAccountNumber}</span>
                                                    <span className="text-success fw-bold">+{(transaction.amount * transaction.exchangeRate).toLocaleString("de-CH")}</span>
                                                </div>
                                            }
                                            <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                <span className="account-number small">
                                                    { transaction.fromAccountNumber == selectedAccount.accountNumber && 
                                                        <span>Outgoing</span>
                                                    }
                                                    { transaction.toAccountNumber == selectedAccount.accountNumber && 
                                                        <span>Incoming</span>
                                                    }
                                                </span>
                                                <span className="small">{selectedAccount.currency}</span>
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
        </div>
    );
}