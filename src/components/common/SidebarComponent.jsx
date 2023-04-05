import { Link } from "react-router-dom";
import { useAuth } from "../security/AuthContext";
import { useEffect, useState } from "react";
import { retrieveCustomerNameForUsernameApi } from "../api/EBankingApiService";

export default function SidebarComponent() {

    const [customerName, setCustomerName] = useState();

    const authContext = useAuth()
    const username = authContext.username
    const isAuthenticated = authContext.isAuthenticated

    useEffect (() => refreshCustomerName())

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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 300 300" stroke="currentColor" fill="none">
                        <path d="M60.211946,238.921002Q86.416185,186.512524,150,186.512524t89.788054,52.408478" transform="matrix(1.299709 0 0 1.299709-44.95635-38.704958)" strokeWidth="16" stroke-linecap="round"/>
                        <ellipse rx="76.396917" ry="76.396917" transform="matrix(.898154 0 0 0.898154 150 99.132923)" strokeWidth="24"/>
                    </svg>
                    <span className="d-none d-sm-inline ms-2 fw-bold">Welcome, {customerName}</span>
                </span>
                
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li className="nav-item">
                        <Link className="nav-link align-middle px-0" to="/portfolio">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <span className="ms-2 ms-1 d-none d-sm-inline">Portfolio</span>
                        </Link>
                    </li>
                    <li>
                        <Link className="nav-link px-0 align-middle" to="#submenu1" data-bs-toggle="collapse">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                            <span className="ms-2 d-none d-sm-inline">Payments</span>
                        </Link>
                        <ul class="collapse nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                            <li class="w-100">
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                            <span className="ms-2 d-none d-sm-inline">Reports</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link align-middle px-0" to="/settings">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fillRule="nonzero" fill="currentColor">
                                <path d="M13.748.92a2.793 2.793 0 014.861 2.015l-.07 1.388a1.092 1.092 0 001.141 1.145l1.39-.07a2.793 2.793 0 012.009 4.862l-1.033.932a1.093 1.093 0 000 1.622l1.034.933a2.793 2.793 0 01-2.015 4.861l-1.388-.07a1.09 1.09 0 00-1.146 1.147l.07 1.393a2.793 2.793 0 01-4.853 2.006l-.933-1.032a1.092 1.092 0 00-1.623.001l-.937 1.033a2.793 2.793 0 01-4.856-2.012l.072-1.388a1.092 1.092 0 00-1.147-1.146l-1.387.07A2.792 2.792 0 01.92 13.751l1.032-.932a1.093 1.093 0 00-.001-1.624l-1.032-.937a2.792 2.792 0 012.011-4.857l1.39.071a1.09 1.09 0 001.146-1.153L5.4 2.929A2.793 2.793 0 0110.256.92l.933 1.031a1.09 1.09 0 001.623-.004zm2.36.82a1.094 1.094 0 00-1.1.323l-.935 1.026a2.79 2.79 0 01-4.146.002l-.93-1.028a1.092 1.092 0 00-1.9.785l.067 1.385A2.792 2.792 0 014.23 7.17L2.845 7.1A1.091 1.091 0 002.061 9l1.03.936a2.794 2.794 0 010 4.146l-1.031.932a1.092 1.092 0 00.79 1.899l1.387-.07a2.792 2.792 0 012.932 2.931l-.071 1.384a1.092 1.092 0 001.898.786l.935-1.031a2.793 2.793 0 014.146 0l.93 1.028a1.092 1.092 0 001.896-.781l-.07-1.388a2.792 2.792 0 012.93-2.932l1.389.07a1.092 1.092 0 00.788-1.9l-1.034-.933a2.794 2.794 0 010-4.147l1.033-.931a1.093 1.093 0 00-.785-1.902l-1.39.07a2.792 2.792 0 01-2.924-2.929l.07-1.388a1.092 1.092 0 00-.672-1.065zm-4.103 4.914a5.352 5.352 0 110 10.704 5.352 5.352 0 010-10.704zm0 1.7a3.652 3.652 0 100 7.304 3.652 3.652 0 000-7.304z"></path>
                            </svg>
                            <span className="ms-2 d-none d-sm-inline">Settings</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        {isAuthenticated &&
                            <Link className="nav-link align-middle px-0" to="/logout" onClick={authContext.logout}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512" fillRule="nonzero" fill="currentColor">
                                    <path d="M358.401,192V12.8c0-7.066-5.734-12.8-12.8-12.8h-332.8c-7.066,0-12.8,5.734-12.8,12.8v486.4 c0,7.066,5.734,12.8,12.8,12.8h332.8c7.066,0,12.8-5.734,12.8-12.8V320h-25.6v166.4h-307.2V25.6h307.2V192H358.401z"/>
                                    <path d="M508.161,246.844l-74.931-76.595c-4.941-5.06-13.047-5.146-18.099-0.205c-5.052,4.941-5.146,13.056-0.205,18.099
                                        l53.854,55.057H193.673c-7.066,0-12.8,5.734-12.8,12.8c0,7.066,5.734,12.8,12.8,12.8h275.098l-53.854,55.057
                                        c-4.941,5.043-4.847,13.158,0.205,18.099c5.06,4.941,13.158,4.855,18.099-0.205l75.128-76.8
                                        C513.289,259.9,513.204,251.785,508.161,246.844z"/>
                                </svg>
                                <span className="ms-2 d-none d-sm-inline">Logout</span>
                            </Link>}
                    </li>
                </ul>
            </div>
        </div>
    )
}