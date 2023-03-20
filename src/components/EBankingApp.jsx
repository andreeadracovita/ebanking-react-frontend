import './EBankingApp.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import ErrorComponent from "./ErrorComponent"
import FooterComponent from "./FooterComponent"
import HeaderComponent from "./HeaderComponent"
import LoginComponent from "./LoginComponent"
import AuthProvider, { useAuth } from "./security/AuthContext"
import AccountsComponent from "./AccountsComponent"
import LogoutComponent from './LogoutComponent'
import PaymentsComponent from './PaymentsComponent'
import ReportsComponent from './ReportsComponent'

function AuthenticatedRoute({ children }) {
    const authContext = useAuth()

    if (authContext.isAuthenticated)
        return children

    return <Navigate to="/" />
}

export default function EBankingApp() {
    return (
        <div className="EBankingApp">
            <AuthProvider>
                <BrowserRouter>
                    <HeaderComponent/>
                    <Routes>
                        <Route path='/' element={<LoginComponent/>}/>
                        <Route path='/accounts' element={
                            <AuthenticatedRoute>
                                <AccountsComponent/>
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
                        <Route path='/logout' element={
                            <AuthenticatedRoute>
                                <LogoutComponent/>
                            </AuthenticatedRoute>
                        }/>
                        <Route path='*' element={<ErrorComponent/>}/>
                    </Routes>
                    <FooterComponent/>
                </BrowserRouter>
            </AuthProvider>
        </div>
    )
}