export default function HeaderComponent() {
    return (
        <nav className="navbar navbar-dark flex-md-row-nowrap bg-royal-blue">
            <div className="navbar-brand text-white ms-4">
                <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="4">
                    <rect x="2" y="2" width="20" height="20" rx="0"></rect>
                </svg>
                <span className="h4 ms-3 fw-bold">WorldBank</span>
            </div>
        </nav>
    );
}