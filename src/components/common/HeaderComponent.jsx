import { ReactComponent as Logo } from "../../assets/eBankingLogo.svg"

export default function HeaderComponent() {
    return (
        <nav className="navbar navbar-dark flex-md-row-nowrap bg-royal-blue">
            <div className="navbar-brand text-white ms-4">
                <Logo width="40" height="40" className=""/>
                <span className="h4 ms-3 fw-bold">WorldBank</span>
            </div>
        </nav>
    );
}