import { useParams } from "react-router-dom"

export default function PaymentsComponent() {

    const {username} = useParams()

    return (
        <div className="Payments">
            <h1>Welcome {username}</h1>
            <div>
                Here you can make payments.
            </div>
        </div>
    )
}