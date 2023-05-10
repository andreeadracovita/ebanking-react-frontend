import { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useLocation } from 'react-router';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { retrieveAllBankAccountsForUsernameApi, retrieveAllTransactionsForBankAccountNumberApi } from './api/EBankingApiService';
import { useAuth } from './security/AuthContext';
import { ReactComponent as CalendarIcon } from '../assets/calendar.svg'; 
import { CHFCurrency } from './common/helpers/HelperFunctions';

export default function ReportsComponent() {
    const intervalValues = ['Last day', 'Last 7 days', 'Last 2 weeks', 'Last month', 'Custom'];
    
    var oneDay = new Date();
    oneDay.setHours(0);
    oneDay.setDate(oneDay.getDate());

    var sevenDays = new Date();
    sevenDays.setHours(0);
    sevenDays.setDate(sevenDays.getDate() - 6); // init 7 days ago

    var twoWeeks = new Date();
    twoWeeks.setHours(0);
    twoWeeks.setDate(twoWeeks.getDate() - 13);

    var lastMonth = new Date();
    lastMonth.setHours(0);
    lastMonth.setDate(lastMonth.getDate() - 29);

    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState();
    const [interval, setInterval] = useState(intervalValues[1]);
    const [startDate, setStartDate] = useState(sevenDays);
    const [endDate, setEndDate] = useState(new Date());

    useEffect (() => {
        retrieveAllBankAccountsForUsernameApi(username)
            .then(response => {
                setAccounts(response.data);
            })
            .catch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect (() => {
        if (location && location.state && location.state.account) {
            setSelectedAccount(location.state.account);
            return;
        }
        if (selectedAccount === undefined && accounts.length > 0) {
            setSelectedAccount(accounts[0]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accounts]);
    useEffect (() => {
        if (selectedAccount != null) {
            retrieveAllTransactionsForBankAccountNumberApi(username, selectedAccount.accountNumber)
                .then(response => {
                    setTransactions(response.data);
                })
                .catch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAccount]);

    const location = useLocation();
    const authContext = useAuth();
    const username = authContext.username;

    function handleSelectedAccountChange(account) {
        setSelectedAccount(account);
    }

    function handleIntervalChange(value) {
        setInterval(value);
        if (value === intervalValues[0]) {
            setStartDate(oneDay);
        } else if (value === intervalValues[1]) {
            setStartDate(sevenDays);
        } else if (value === intervalValues[2]) {
            setStartDate(twoWeeks);
        } else if (value === intervalValues[3]) {
            setStartDate(lastMonth);
        }
    }

    function getMonthShortName(monthNo) {
        const date = new Date();
        date.setMonth(monthNo - 1);
        
        return date.toLocaleString('en-US', { month: 'short' });
    }

    function handleStartDateChange(date) {
        setStartDate(date);
    }

    function handleEndDateChange(date) {
        setEndDate(date);
    }

    return (
        <div className="main-content">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Reports</h1>
            <Dropdown className="mb-4">
                <Dropdown.Toggle id="dropdown-basic" className="select-field-account">
                    {
                        selectedAccount &&
                        <div>
                            <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                <span>{selectedAccount.accountName}</span>
                                <span className="account-balance">{CHFCurrency.format(selectedAccount.balance)}</span>
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
                                            <span className="account-balance">{CHFCurrency.format(account.balance)}</span>
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
            <span className="mb-4 d-flex flex-nowrap">
                <CalendarIcon width="36px" height="36px" className="text-royal-blue me-3"/>
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" className="select-field-interval">
                        {interval}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    {
                        intervalValues.map(
                            (value) => (
                                <Dropdown.Item className="select-dropdown-interval" key={value} onClick={() => handleIntervalChange(value)}>
                                    {value}
                                </Dropdown.Item>
                            )
                        )
                    }
                    </Dropdown.Menu>
                </Dropdown>

                {
                    interval === 'Custom' &&
                    <span>
                        <DatePicker
                            className="datepicker ms-3 me-3"
                            selected={startDate}
                            filterDate={(date) => date <= endDate}
                            onChange={(date) => handleStartDateChange(date)}
                            dateFormat="dd/MM/yyyy" />
                    </span>
                }
                {
                    interval === 'Custom' &&
                    <span>
                        <DatePicker
                            className="datepicker mb-3"
                            selected={endDate}
                            filterDate={(date) => date >= startDate}
                            onChange={(date) => handleEndDateChange(date)}
                            dateFormat="dd/MM/yyyy" />
                    </span>
                }
            </span>
            <div style={{width:1000+'px'}}>
            {
                selectedAccount && transactions.length === 0 &&
                <span>
                    <hr/>
                    No transactions for this account.
                </span>
            }
            {startDate.toDateString()} - {endDate.toDateString()}
            {
                transactions.filter(
                        transaction => {
                            let date = new Date(transaction.issueDate);
                            date.setHours(1);
                            return date >= startDate && date <= endDate;
                        }
                    )
                    .map(
                        transaction => (
                            <span key={transaction.id}>
                                <hr/>
                                <div className="d-flex flex-nowrap d-inline">
                                    <div className="text-center btn btn-royal-blue date-badge me-3">
                                        <span>{String(new Date(transaction.issueDate).getDate()).padStart(2, '0')}</span>
                                        <br/>
                                        <span>{getMonthShortName(new Date(transaction.issueDate).getMonth() + 1).toUpperCase()}</span>
                                    </div>
                                    <div className="col-11 align-middle">
                                        { transaction.fromAccountNumber === selectedAccount.accountNumber && 
                                            <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                <span>{transaction.toAccountNumber}</span>
                                                <span className="text-danger fw-bold">-{CHFCurrency.format(transaction.amount)}</span>
                                            </div>
                                        }
                                        { transaction.toAccountNumber === selectedAccount.accountNumber && 
                                            <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                                <span>{transaction.fromAccountNumber}</span>
                                                <span className="text-success fw-bold">+{CHFCurrency.format(transaction.amount * transaction.exchangeRate)}</span>
                                            </div>
                                        }
                                        <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                            <span className="account-number small">
                                                { transaction.fromAccountNumber === selectedAccount.accountNumber && 
                                                    <span>Outgoing</span>
                                                }
                                                { transaction.toAccountNumber === selectedAccount.accountNumber && 
                                                    <span>Incoming</span>
                                                }
                                            </span>
                                            <span className="small">{selectedAccount.currency}</span>
                                        </div>
                                    </div>
                                </div>
                            </span>
                        )
                    )
            }
            </div>
        </div>
    );
}