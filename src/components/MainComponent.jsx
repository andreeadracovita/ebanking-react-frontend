import { Navigate, Route, Routes } from "react-router";
import PortfolioComponent from "./PortfolioComponent";
import ErrorComponent from "./ErrorComponent";
import LoginComponent from "./LoginComponent";
import LogoutComponent from "./LogoutComponent";
import PaymentsComponent from "./PaymentsComponent";
import ReportsComponent from "./ReportsComponent";
import SettingsComponent from "./SettingsComponent";
import { useAuth } from "./security/AuthContext";

function AuthenticatedRoute({ children }) {
    const authContext = useAuth()

    if (authContext.isAuthenticated) {
        return children
    }

    return <Navigate to="/" />
}

export default function MainComponent() {
    return (
        <div className="col-sm-10 ml-sm-auto mt-4">
            <Routes>
                <Route path='/' element={<LoginComponent/>}/>
                <Route path='/portfolio' element={
                    <AuthenticatedRoute>
                        <PortfolioComponent/>
                    </AuthenticatedRoute>
                }/>
                <Route path='/payments' element={
                    <AuthenticatedRoute>
                        <PaymentsComponent/>
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