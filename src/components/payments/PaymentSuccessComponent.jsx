import { useNavigate } from 'react-router';

export default function PaymentSuccessComponent({ amount, destination, setPaymentState, resetPaymentForm}) {
    const navigate = useNavigate();

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    function onNewPaymentClicked() {
        resetPaymentForm();
        setPaymentState('start');
    }

    return (
        <div className="text-center">
            <div className="mb-5 fw-bold">
                You transferred {amount.value} {amount.currency} to
                <br/>
                {destination}
            </div>
            <div>
                <button className="btn btn-royal-blue px-5 mb-3" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                <br/>
                { resetPaymentForm && <button className="btn btn-secondary px-5" type="button" name="anotherPayment" onClick={onNewPaymentClicked}>Another payment</button> }
            </div>
        </div>
    );
}