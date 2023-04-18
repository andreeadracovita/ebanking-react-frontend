import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAuth } from '../security/AuthContext';
import { retrieveCustomerNameForUsernameApi } from '../api/EBankingApiService';
import { ReactComponent as HomeIcon } from '../../assets/home.svg';
import { ReactComponent as LogoutIcon } from '../../assets/logout.svg';
import { ReactComponent as PaymentsIcon } from '../../assets/payments.svg';
import { ReactComponent as ReportsIcon } from '../../assets/reports.svg';
import { ReactComponent as SettingsIcon } from '../../assets/settings.svg';
import { ReactComponent as UserIcon } from '../../assets/user.svg';

export default function SidebarComponent() {
    const [customerName, setCustomerName] = useState();

    const authContext = useAuth();
    const username = authContext.username;
    const isAuthenticated = authContext.isAuthenticated;

    useEffect (() => refreshCustomerName(), []);

    function refreshCustomerName() {
        retrieveCustomerNameForUsernameApi(username)
            .then(response => {
                setCustomerName(response.data)
            })
            .catch(error => console.log(error))
    }

    return (
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-royal-blue">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 mt-4 mb-4">
                <span className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <UserIcon width="24" height="24"/>
                    <span className="d-none d-sm-inline ms-2 fw-bold">Welcome, {customerName}</span>
                </span>
                
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li className="nav-item">
                        <Link className="nav-link align-middle px-0" to="/portfolio">
                            <HomeIcon width="24" height="24"/>
                            <span className="ms-2 ms-1 d-none d-sm-inline">Portfolio</span>
                        </Link>
                    </li>
                    <li>
                        <Link className="nav-link px-0 align-middle" to="#submenu1" data-bs-toggle="collapse">
                            <PaymentsIcon width="24" height="24"/>
                            <span className="ms-2 d-none d-sm-inline">Payments</span>
                        </Link>
                        <ul className="collapse nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                            <li className="w-100">
                                <Link to="/payment/self" className="nav-link px-0 ms-3">
                                    <span className="d-none d-sm-inline">To myself</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/payment/other" className="nav-link px-0 ms-3">
                                    <span className="d-none d-sm-inline">To someone else</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/exchange" className="nav-link px-0 ms-3">
                                    <span className="d-none d-sm-inline">Exchange</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link align-middle px-0" to="/reports">
                            <ReportsIcon width="24" height="24"/>
                            <span className="ms-2 d-none d-sm-inline">Reports</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link align-middle px-0" to="/settings">
                            <SettingsIcon width="24" height="24"/>
                            <span className="ms-2 d-none d-sm-inline">Settings</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        {isAuthenticated &&
                            <Link className="nav-link align-middle px-0" to="/logout" onClick={authContext.logout}>
                                <LogoutIcon width="24" height="24"/>
                                <span className="ms-2 d-none d-sm-inline">Logout</span>
                            </Link>}
                    </li>
                </ul>
            </div>
        </div>
    );
}