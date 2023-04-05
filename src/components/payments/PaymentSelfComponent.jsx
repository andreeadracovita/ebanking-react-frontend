export default function PaymentSelfComponent() {

    return (
        <div>
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Send money to myself</h1>
            <div className="mb-5">
                <h1 className="h4 mb-2 text-royal-blue fw-bold">From account</h1>
                <span>Dropdown with accounts</span>
                <br/>
                <span>Account name | Account number | Balance Currency</span>
            </div>

            <div className="mb-5">
                <h1 className="h4 mb-2 text-royal-blue fw-bold">To account</h1>
                <span>Dropdown with accounts</span>
                <br/>
                <span>Account name | Account number | Balance Currency</span>
            </div>

            {/* <div className="mb-5">
                <h1 className="h4 mb-2 text-royal-blue fw-bold">Transfer details</h1>
                <span>Input fields</span>
                <br/>
                <form>
                    <div className="mb-5">
                        <input className="input-field" type="number" name="amount" placeholder="Amount" onChange={handleAmountChange} />
                    </div>
                    <div className="mb-5">
                        <input className="input-field" type="text" name="description" placeholder="Payment description" onChange={handleDescriptionChange} />
                    </div>
                    <div className="mb-5">
                        <input className="input-field" type="date" name="date" onChange={handleDateChange} />
                    </div>
                    <div>
                        <button className="btn btn-royal-blue px-5" type="button" name="login" onClick={handleSubmit}>Next</button>
                    </div>
                </form>
            </div> */}
        </div>
    )
}