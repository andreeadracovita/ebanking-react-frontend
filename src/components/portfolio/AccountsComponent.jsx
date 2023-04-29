import { Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import { ReactComponent as CheckingAccountIcon } from '../../assets/checking-account.svg'; 
import { ReactComponent as CreditAccountIcon } from '../../assets/credit-account.svg'; 
import { ReactComponent as SavingsAccountIcon } from '../../assets/savings-account.svg'; 

import { ReactComponent as WalletIcon } from '../../assets/wallet.svg';
import { ReactComponent as CurrencyIcon } from '../../assets/currency.svg';
import { ReactComponent as ReportIcon } from '../../assets/report.svg';
import { ReactComponent as CustomizeIcon } from '../../assets/customize.svg';
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg';
import { ReactComponent as DetailsIcon } from '../../assets/details.svg';
import { ReactComponent as PiggyBankIcon } from '../../assets/piggy-bank.svg';

export default function AccountsComponent({ type, accounts}) {
    const navigate = useNavigate();

    function redirectPaymentOther(account) {
        navigate('/payment/other', { state: { fromAccount: account } });
    }

    function redirectExchange(account) {
        navigate('/exchange', { state: { fromAccount: account } });
    }

    function redirectSave(account) {
        navigate('/payment/self', { state: { toAccount: account } });
    }

    function redirectReport(account) {
        navigate('/reports', { state: { account: account } });
    }

    function redirectAccountDetails(account) {
        navigate('/account/details', { state: {account: account } })
    }

    function redirectCustomize(account) {
        navigate('/account/customize', { state: { account: account } })
    }

    function redirectDeleteAccount(account) {
        navigate('/accounts/delete', { state: { account: account } });
    }

    function redirectReimburseCredit(account) {
        navigate('/creditcard/reimburse', { state: { account: account }});
    }
    
    return (
        <span>
            <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                <span className="h4 text-royal-blue">
                    { type === 'CHECKING' && <span><CheckingAccountIcon width="36px" height="36px" /><span className="ms-3">Accounts</span></span> }
                    { type === 'SAVINGS' && <span><SavingsAccountIcon width="36px" height="36px" /><span className="ms-3">Savings</span></span> }
                    { type === 'CREDIT' && <span><CreditAccountIcon width="36px" height="36px" /><span className="ms-3">Credit</span></span> }
                </span>
                { type === 'CHECKING' && <button className="btn btn-royal-blue" onClick={() => { navigate('/accounts/open-checking') }}>+</button> }
                { type === 'SAVINGS' && <button className="btn btn-royal-blue" onClick={() => { navigate('/accounts/open-savings') }}>+</button> }
                { type === 'CREDIT' && <button className="btn btn-royal-blue" onClick={() => { navigate('/accounts/request-credit') }}>+</button> }
            </div>
            <Accordion className="mt-3">
            {
                accounts.map(
                    account => (
                        <Accordion.Item key={account.accountNumber} eventKey={account.accountNumber}>
                            <Accordion.Header>
                                <div className="mt-3 me-2 w-100">
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span>{account.accountName}</span>
                                        <span className="account-balance">{account.balance.toLocaleString("de-CH")}</span>
                                    </div>
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span className="account-number">{account.accountNumber}</span>
                                        <span>{account.currency}</span>
                                    </div>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <div className="d-flex flex-wrap">
                                    {
                                        type === 'CHECKING' && account.currency === 'CHF' &&
                                        <div className="text-center portfolio-accordion-button" onClick={() => redirectPaymentOther(account)}>
                                            <WalletIcon width="48" height="48" />
                                            <br/>
                                            <span>Payment</span>
                                        </div>
                                    }
                                    {
                                        type === 'CHECKING' && account.currency !== 'CHF' &&
                                        <div className="text-center portfolio-accordion-button" onClick={() => redirectExchange(account)}>
                                            <CurrencyIcon width="48" height="48" />
                                            <br/>
                                            <span>Exchange</span>
                                        </div>
                                    }
                                    {
                                        type === 'SAVINGS' &&
                                        <div className="text-center portfolio-accordion-button" onClick={() => redirectSave(account)}>
                                            <PiggyBankIcon width="48" height="48" />
                                            <br/>
                                            <span>Save</span>
                                        </div>
                                    }
                                    {
                                        type === 'CREDIT' &&
                                        <div className="text-center portfolio-accordion-button" onClick={() => redirectReimburseCredit(account)}>
                                            <WalletIcon width="48" height="48" />
                                            <br/>
                                            <span>Reimburse</span>
                                        </div>
                                    }
                                    <div className="text-center portfolio-accordion-button" onClick={() => redirectReport(account)}>
                                        <ReportIcon width="48" height="48" />
                                        <br/>
                                        <span>Report</span>
                                    </div>
                                    {
                                        type !== 'SAVINGS' &&
                                        <div className="text-center portfolio-accordion-button" onClick={() => redirectAccountDetails(account)}>
                                            <DetailsIcon width="48" height="48" />
                                            <br/>
                                            <span>Details</span>
                                        </div>
                                    }
                                    {
                                        type !== 'CREDIT' &&
                                        <div className="text-center portfolio-accordion-button" onClick={() => redirectCustomize(account)}>
                                            <CustomizeIcon width="48" height="48" />
                                            <br/>
                                            <span>Customize</span>
                                        </div>
                                    }
                                    {
                                        type !== 'CREDIT' &&
                                        <div className="text-center portfolio-accordion-button" onClick={() => redirectDeleteAccount(account)}>
                                            <DeleteIcon width="48" height="48" />
                                            <br/>
                                            <span>Close</span>
                                        </div>
                                    }
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                )
            }
            </Accordion>
        </span>   
    );
}