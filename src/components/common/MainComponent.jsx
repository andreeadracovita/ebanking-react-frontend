import { Navigate, Route, Routes } from "react-router";
import PortfolioComponent from "../PortfolioComponent";
import ErrorComponent from "../ErrorComponent";
import LoginComponent from "../LoginComponent";
import LogoutComponent from "../LogoutComponent";
import ReportsComponent from "../ReportsComponent";
import SettingsComponent from "../SettingsComponent";
import { useAuth } from "../security/AuthContext";
import ExchangeComponent from "../payments/ExchangeComponent";
import PaymentOtherComponent from "../payments/PaymentOtherComponent";
import PaymentSelfComponent from "../payments/PaymentSelfComponent";

function AuthenticatedRoute({ children }) {
    const authContext = useAuth()

    if (authContext.isAuthenticated) {
        return children
    }

    return <Navigate to="/" />
}

export default function MainComponent() {
    return (
        <div className="col-sm-9 py-3 mt-4 ms-4">
            <Routes>
                <Route path='/' element={<LoginComponent/>}/>
                <Route path='/portfolio' element={
                    <AuthenticatedRoute>
                        <PortfolioComponent/>
                    </AuthenticatedRoute>
                }/>
                <Route path='/payment/self' element={
                    <AuthenticatedRoute>
                        <PaymentSelfComponent/>
                    </AuthenticatedRoute>
                }/>
                <Route path='/payment/other' element={
                    <AuthenticatedRoute>
                        <PaymentOtherComponent/>
                    </AuthenticatedRoute>
                }/>
                <Route path='/exchange' element={
                    <AuthenticatedRoute>
                        <ExchangeComponent/>
                    </AuthenticatedRoute>
                }/>
                <Route path='/reports' element={
                    <AuthenticatedRoute>
                        <ReportsComponent/>
                    </AuthenticatedRoute>
                }/>
                <Route path='/settings' element={
                    <AuthenticatedRoute>
                        <SettingsComponent/>
                    </AuthenticatedRoute>
                }/>
                <Route path='/logout' element={
                    <AuthenticatedRoute>
                        <LogoutComponent/>
                    </AuthenticatedRoute>
                }/>
                <Route path='*' element={<ErrorComponent/>}/>
            </Routes>
        </div>
    )
}