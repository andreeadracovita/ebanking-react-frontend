import { Link } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

export default function HeaderComponent() {

    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated

    // to={`/accounts/${authContext.username}`}
    return (
        <nav className="navbar navbar-dark flex-md-row-nowrap bg-royal-blue">
        {/* <nav className="navbar navbar-expand flex-column flex-md-row bd-navbar"> */}
            <div className="navbar-brand text-white ms-4">
                <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4">
                    <rect x="2" y="2" width="20" height="20" rx="0"></rect>
                </svg>
                <span className="h4 ms-3 fw-bold">WorldBank</span>
            </div>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
                    {isAuthenticated && <Link className="nav-link text-white" to="/logout" onClick={authContext.logout}>Logout</Link>}
                </li>
            </ul>
        </nav>
    )
}