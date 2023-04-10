import { createTransactionApi } from "../api/EBankingApiService";
import { useAuth } from "../security/AuthContext";

export default function PaymentConfirmComponent({ paymentType, transaction, setPaymentState }) {

    const authContext = useAuth();
    const username = authContext.username;

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

    return (
        <div>
            <div className="d-flex justify-content-center">
                <div className="bg-light-royal-blue p-3 mb-3 text-left w-50">
                    <p>Amount:</p>
                    <p className="ms-3 fw-bold">{transaction.amount} {transaction.currency}</p>
                    <br/>
                    <p>From account:</p>
                    <p className="ms-3 fw-bold">{transaction.fromAccountNumber}</p>
                    <br/>
                    <hr/>
                    {
                        paymentType == 'Other' &&
                        <span>
                            <p>Beneficiary name:</p>
                            <p className="ms-3 fw-bold">{transaction.beneficiaryName}</p>
                        </span>
                    }
                    <p>To account:</p>
                    <p className="ms-3 fw-bold">{transaction.toAccountNumber}</p>
                    <br/>
                    <p>Payment details:</p>
                    <p className="ms-3 fw-bold">{transaction.description}</p>
                </div>
            </div>
            <div className="text-center">
                <button className="btn btn-royal-blue px-5 mb-3" type="button" name="confirm" onClick={onConfirmForm}>Sign</button>
                <br/>
                <button className="btn btn-secondary px-5" type="button" name="back" onClick={onBack}>Back</button>
            </div>
        </div>
    );
}