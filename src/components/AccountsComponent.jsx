import { useParams } from "react-router-dom"

export default function AccountsComponent() {

    const {username} = useParams()

    return (
        <div className="Accounts">
            <h1>Welcome {username}</h1>
            <div>
                Manage your accounts
            </div>
        </div>
    )
}