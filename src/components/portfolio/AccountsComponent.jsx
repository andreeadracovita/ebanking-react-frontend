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
import { CHFCurrency } from '../common/helpers/HelperFunctions';

export default function AccountsComponent({ type, accounts}) {
    const pageName = type === 'CHECKING' ?
                        'Checking accounts' :
                        (type === 'SAVINGS' ?
                            'Savings' :
                            (type === 'CREDIT' ? 'Credits' : undefined));

    const icon = type === 'CHECKING' ?
                    <CheckingAccountIcon width="22px" height="22px" /> :
                    (type === 'SAVINGS' ?
                        <SavingsAccountIcon width="22px" height="22px" /> :
                        (type === 'CREDIT' ? <CreditAccountIcon width="22px" height="22px" /> : undefined));
    
    const openAccountPath = type === 'CHECKING' ?
                                '/accounts/open-checking' :
                                (type === 'SAVINGS' ?
                                    '/accounts/open-savings' :
                                    (type === 'CREDIT' ? '/accounts/request-credit' : undefined));

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
                <span className="h5 text-royal-blue">
                    <span>{icon}<span className="ms-3">{pageName}</span></span>
                </span>
                <button className="btn btn-royal-blue fontSizeGeneral" onClick={() => { navigate(openAccountPath) }}>+</button>
            </div>
            <Accordion>
            {
                accounts.map(
                    account => (
                        <Accordion.Item key={account.accountNumber} eventKey={account.accountNumber}>
                            <Accordion.Header>
                                <div className="me-2 w-100">
                                    <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <span>{account.accountName}</span>
                                        <span className="account-balance">{CHFCurrency.format(account.balance)}</span>
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
                                            <WalletIcon width="26" height="26" />
                                            <br/>
                                            <span>Payment</span>
                                        </div>
                                    }
                                    {
                                        type === 'CHECKING' && account.currency !== 'CHF' &&
                                        <div className="text-center portfolio-accordion-button" onClick={() => redirectExchange(account)}>
                                            <CurrencyIcon width="26" height="26" />
                                            <br/>
                                            <span>Exchange</span>
                                        </div>
                                    }
                                    {
                                        type === 'SAVINGS' &&
                                        <div className="text-center portfolio-accordion-button" onClick={() => redirectSave(account)}>
                                            <PiggyBankIcon width="26" height="26" />
                                            <br/>
                                            <span>Save</span>
                                        </div>
                                    }
                                    {
                                        type === 'CREDIT' &&
                                        <div className="text-center portfolio-accordion-button" onClick={() => redirectReimburseCredit(account)}>
                                            <WalletIcon width="26" height="26" />
                                            <br/>
                                            <span>Reimburse</span>
                                        </div>
                                    }
                                    <div className="text-center portfolio-accordion-button" onClick={() => redirectReport(account)}>
                                        <ReportIcon width="26" height="26" />
                                        <br/>
                                        <span>Report</span>
                                    </div>
                                    {
                                        type !== 'SAVINGS' &&
                                        <div className="text-center portfolio-accordion-button" onClick={() => redirectAccountDetails(account)}>
                                            <DetailsIcon width="26" height="26" />
                                            <br/>
                                            <span>Details</span>
                                        </div>
                                    }
                                    {
                                        type !== 'CREDIT' &&
                                        <div className="text-center portfolio-accordion-button" onClick={() => redirectCustomize(account)}>
                                            <CustomizeIcon width="26" height="26" />
                                            <br/>
                                            <span>Customize</span>
                                        </div>
                                    }
                                    {
                                        type !== 'CREDIT' &&
                                        <div className="text-center portfolio-accordion-button" onClick={() => redirectDeleteAccount(account)}>
                                            <DeleteIcon width="26" height="26" />
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