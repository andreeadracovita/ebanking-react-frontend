import { useNavigate } from 'react-router';

export default function PaymentFailureComponent({ setComponentState }) {
    const navigate = useNavigate();

    function onRetryPaymentClicked() {
        setComponentState('start');
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    return (
        <div>
            <p className="mb-5 fw-bold">Your transaction initiation failed. [Response reason.]</p>
            <button className="btn btn-royal-blue btn-form mb-3" type="button" name="anotherPayment" onClick={onRetryPaymentClicked}>Retry payment.</button>
            <br/>
            <button className="btn btn-royal-blue btn-form" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
        </div>
    );
}