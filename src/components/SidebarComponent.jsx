import { Link } from "react-router-dom";

export default function SidebarComponent() {

    // const {username} = useParams()

    return (
        <nav className="col-md-1 d-none d-md-block bg-primary sidebar">
            <div className="sidebar">
                <ul className="nav flex-column">
                    {/* <li className="nav-item text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 300 300" stroke="currentColor" fill="none">
                                <path d="M60.211946,238.921002Q86.416185,186.512524,150,186.512524t89.788054,52.408478" transform="matrix(1.299709 0 0 1.299709-44.95635-38.704958)" stroke-width="16" stroke-linecap="round"/>
                                <ellipse rx="76.396917" ry="76.396917" transform="matrix(.898154 0 0 0.898154 150 99.132923)" stroke-width="24"/>
                            </svg>
                            {username}
                    </li> */}
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/accounts">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            Portfolio
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/payments">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                                <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                            Payments
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/reports">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                            Reports
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/settings">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fillRule="nonzero" fill="currentColor">
                                <path d="M13.748.92a2.793 2.793 0 014.861 2.015l-.07 1.388a1.092 1.092 0 001.141 1.145l1.39-.07a2.793 2.793 0 012.009 4.862l-1.033.932a1.093 1.093 0 000 1.622l1.034.933a2.793 2.793 0 01-2.015 4.861l-1.388-.07a1.09 1.09 0 00-1.146 1.147l.07 1.393a2.793 2.793 0 01-4.853 2.006l-.933-1.032a1.092 1.092 0 00-1.623.001l-.937 1.033a2.793 2.793 0 01-4.856-2.012l.072-1.388a1.092 1.092 0 00-1.147-1.146l-1.387.07A2.792 2.792 0 01.92 13.751l1.032-.932a1.093 1.093 0 00-.001-1.624l-1.032-.937a2.792 2.792 0 012.011-4.857l1.39.071a1.09 1.09 0 001.146-1.153L5.4 2.929A2.793 2.793 0 0110.256.92l.933 1.031a1.09 1.09 0 001.623-.004zm2.36.82a1.094 1.094 0 00-1.1.323l-.935 1.026a2.79 2.79 0 01-4.146.002l-.93-1.028a1.092 1.092 0 00-1.9.785l.067 1.385A2.792 2.792 0 014.23 7.17L2.845 7.1A1.091 1.091 0 002.061 9l1.03.936a2.794 2.794 0 010 4.146l-1.031.932a1.092 1.092 0 00.79 1.899l1.387-.07a2.792 2.792 0 012.932 2.931l-.071 1.384a1.092 1.092 0 001.898.786l.935-1.031a2.793 2.793 0 014.146 0l.93 1.028a1.092 1.092 0 001.896-.781l-.07-1.388a2.792 2.792 0 012.93-2.932l1.389.07a1.092 1.092 0 00.788-1.9l-1.034-.933a2.794 2.794 0 010-4.147l1.033-.931a1.093 1.093 0 00-.785-1.902l-1.39.07a2.792 2.792 0 01-2.924-2.929l.07-1.388a1.092 1.092 0 00-.672-1.065zm-4.103 4.914a5.352 5.352 0 110 10.704 5.352 5.352 0 010-10.704zm0 1.7a3.652 3.652 0 100 7.304 3.652 3.652 0 000-7.304z" fill-rule="nonzero"></path>
                            </svg>
                            Settings
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}