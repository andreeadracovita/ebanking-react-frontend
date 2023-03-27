import { Link } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

export default function HeaderComponent() {

    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated

    // to={`/accounts/${authContext.username}`}
    return (
        <nav className="navbar navbar-dark bg-primary flex-md-row-nowrap">
        {/* <nav className="navbar navbar-expand flex-column flex-md-row bd-navbar"> */}
            <div className="navbar-brand text-white ms-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                eBanking
            </div>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
                    {isAuthenticated && <Link className="nav-link text-white" to="/logout" onClick={authContext.logout}>Logout</Link>}
                </li>
            </ul>
        </nav>
    )
}