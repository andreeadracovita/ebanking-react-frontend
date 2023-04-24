import { useNavigate } from 'react-router';

export default function PaymentSuccessComponent({ amount, destination, resetPaymentForm, refreshAccounts }) {
    const navigate = useNavigate();

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    function onNewPaymentClicked() {
        resetPaymentForm();
        refreshAccounts();
    }

    return (
        <div>
            <p className="mb-5 fw-bold">You transferred {amount.value} {amount.currency} to {destination}.</p>
            <button className="btn btn-royal-blue btn-form mb-3" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
            <br/>
            { resetPaymentForm && <button className="btn btn-secondary btn-form" type="button" name="anotherPayment" onClick={onNewPaymentClicked}>Another payment</button> }
        </div>
    );
}