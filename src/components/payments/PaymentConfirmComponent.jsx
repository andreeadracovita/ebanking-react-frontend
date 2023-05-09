import { ComponentState } from '../common/constants/Constants';

export default function PaymentConfirmComponent({ paymentType, transaction, setComponentState, targetCurrency, onConfirmForm }) {
    function onBack() {
        setComponentState(ComponentState.start);
    }

    return (
        <div>
            <div className="bg-light-royal-blue p-5 mb-5 w-50">
                {
                    paymentType !== 'exchange' &&
                    <span>
                        <p>Amount:</p>
                        <p className="ms-3 fw-bold">{transaction.amount.toFixed(2)} {transaction.currency}</p>
                    </span>
                }
                {
                    paymentType === 'exchange' &&
                    <span>
                        <p>Exchanged amount:</p>
                        <p className="ms-3 fw-bold">{transaction.amount.toFixed(2)} {transaction.currency}</p>
                        <p>Exchange rate:</p>
                        <p className="ms-3 fw-bold">1 {targetCurrency} = {(1 / transaction.exchangeRate).toFixed(4)} {transaction.currency} </p>
                        <p>Transferred amount:</p>
                        <p className="ms-3 fw-bold">{(transaction.amount * transaction.exchangeRate).toFixed(2)} {targetCurrency}</p>
                    </span>
                }
                <p>From account:</p>
                <p className="ms-3 fw-bold">{transaction.fromAccountNumber}</p>
                <hr/>
                {
                    paymentType === 'other' &&
                    <span>
                        <p>Beneficiary name:</p>
                        <p className="ms-3 fw-bold">{transaction.beneficiaryName}</p>
                    </span>
                }
                <p>To account:</p>
                <p className="ms-3 fw-bold">{transaction.toAccountNumber}</p>
                {
                    paymentType !== 'exchange' &&
                    <span>
                        <br/>
                        <p>Payment details:</p>
                        <p className="ms-3 fw-bold">{transaction.description}</p>
                    </span>
                }
            </div>
            <button className="btn btn-royal-blue btn-form mb-3" type="button" name="confirm" onClick={onConfirmForm}>Sign</button>
            <br/>
            <button className="btn btn-secondary btn-form" type="button" name="back" onClick={onBack}>Back</button>
        </div>
    );
}