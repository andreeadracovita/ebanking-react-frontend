import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAuth } from '../security/AuthContext';
import { retrieveCustomerNameForUsernameApi } from '../api/EBankingApiService';
import { ReactComponent as Logo } from "../../assets/eBankingLogo.svg"
import { ReactComponent as UserIcon } from '../../assets/user.svg';
import { ReactComponent as HomeIcon } from '../../assets/home.svg';
import { ReactComponent as PaymentsIcon } from '../../assets/payments.svg';
import { ReactComponent as ReportsIcon } from '../../assets/reports.svg';
import { ReactComponent as SettingsIcon } from '../../assets/settings.svg';
import { ReactComponent as LogoutIcon } from '../../assets/logout.svg';

export default function SidebarComponent() {
    const [customerName, setCustomerName] = useState();

    const authContext = useAuth();
    const username = authContext.username;
    const isAuthenticated = authContext.isAuthenticated;

    const navigate = useNavigate();

    useEffect (() => {
        if (isAuthenticated) {
            retrieveCustomerNameForUsernameApi(username)
            .then(response => {
                setCustomerName(response.data)
            })
            .catch()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    function onLogoutClicked() {
        authContext.logout();
        navigate('/');
        window.location.reload(false);
    }

    return (
        <div className="sidebar">
            <span style={{ cursor:'default' }}>
                <Logo width="26" height="26" />
                <span className="ms-2 fw-bold align-middle" style={{fontSize:20+'px', fontWeight:700}}>WorldBank</span>
            </span>
            {
                isAuthenticated === false &&
                <span>
                    <ul className="nav flex-column mt-5" id="menu">
                        <li className="nav-item">
                            <Link className="nav-link px-0" to="/">
                                <HomeIcon width="16" height="16"/>
                                <span className="ms-2 ms-1 d-none d-sm-inline align-middle">Login</span>
                            </Link>
                        </li>
                    </ul>
                </span>
            }
            {
                isAuthenticated &&
                <span>
                    <span className="d-flex mt-5 mb-4 text-white text-decoration-none" style={{ cursor:'default' }}>
                        <UserIcon width="16" height="16"/>
                        <span className="d-sm-inline ms-2 fw-bold">{customerName}</span>
                    </span>
                    
                    <ul className="nav flex-column" id="menu">
                        <li className="nav-item">
                            <Link className="nav-link px-0" to="/portfolio">
                                <HomeIcon width="16" height="16"/>
                                <span className="ms-2 d-sm-inline align-middle">Portfolio</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="nav-link px-0" to="#submenupayments" data-bs-toggle="collapse">
                                <PaymentsIcon width="16" height="16"/>
                                <span className="ms-2 d-sm-inline align-middle">Payments</span>
                            </Link>
                            <ul className="collapse nav flex-column ms-5" id="submenupayments" data-bs-parent="#menu">
                                <span>
                                    <li>
                                        <Link to="/payment/self" className="nav-link px-0">
                                            <span className="d-sm-inline">To myself</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/payment/other" className="nav-link px-0">
                                            <span className="d-sm-inline">To someone else</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/exchange" className="nav-link px-0">
                                            <span className="d-sm-inline">Exchange</span>
                                        </Link>
                                    </li>
                                </span>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-0" to="/reports">
                                <ReportsIcon width="16" height="16"/>
                                <span className="ms-2 d-sm-inline align-middle">Reports</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-0" to="#submenusettings" data-bs-toggle="collapse">
                                <SettingsIcon width="16" height="16"/>
                                <span className="ms-2 d-sm-inline align-middle">Settings</span>
                            </Link>
                            <ul className="collapse nav flex-column ms-5" id="submenusettings" data-bs-parent="#menu">
                                <li>
                                    <Link to="/settings/password" className="nav-link px-0">
                                        <span className="d-sm-inline">Change password</span>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-0" to="/" onClick={ onLogoutClicked }>
                                <LogoutIcon width="16" height="16"/>
                                <span className="ms-2 d-sm-inline align-middle">Logout</span>
                            </Link>
                        </li>
                    </ul>
                </span>
            }
        </div>
    );
}