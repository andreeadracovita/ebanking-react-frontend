import { useParams } from "react-router-dom"

export default function ReportsComponent() {

    const {username} = useParams()

    return (
        <div className="Reports">
            <h1>Welcome {username}</h1>
            <div>
                Here you can see reports with filters, charts, transactions list.
            </div>
        </div>
    )
}