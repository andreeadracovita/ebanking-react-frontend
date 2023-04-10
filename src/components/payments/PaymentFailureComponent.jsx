import { useNavigate } from "react-router";

export default function PaymentFailureComponent({ setPaymentState }) {

    const navigate = useNavigate();

    function onRetryPaymentClicked() {
        setPaymentState('start');
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    return (
        <div className="text-center">
            <div className="mb-5 fw-bold">
                Your transaction initiation failed.
                <br/>
                [Response reason.]
            </div>
            <div>
                <button className="btn btn-royal-blue px-5 mb-3" type="button" name="anotherPayment" onClick={onRetryPaymentClicked}>Retry payment.</button>
                <br/>
                <button className="btn btn-royal-blue px-5" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
            </div>
        </div>
    );
}