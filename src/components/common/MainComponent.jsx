import { Navigate, Route, Routes } from 'react-router';

import { useAuth } from '../security/AuthContext';
import PortfolioComponent from '../portfolio/PortfolioComponent';
import ErrorComponent from '../ErrorComponent';
import ReportsComponent from '../ReportsComponent';
import ExchangeComponent from '../payments/ExchangeComponent';
import PaymentOtherComponent from '../payments/PaymentOtherComponent';
import PaymentSelfComponent from '../payments/PaymentSelfComponent';
import OpenAccountComponent from '../accounts-options/OpenAccountComponent';
import OpenSavingsComponent from '../accounts-options/OpenSavingsComponent';
import DeleteAccountComponent from '../accounts-options/DeleteAccountComponent';
import ReimburseComponent from '../payments/ReimburseComponent';
import CustomizeAccountComponent from '../accounts-options/CustomizeAccountComponent';
import BankAccountDetailsComponent from '../accounts-options/BankAccountDetailsComponent';
import CardDetailsComponent from '../card-options/CardDetailsComponent';
import PasswordComponent from '../PasswordComponent';
import LoginComponent from '../LoginComponent';
import RequestAccountComponent from '../RequestAccountComponent';
import CreateVirtualCardComponent from '../card-options/CreateVirtualCardComponent';

function AuthenticatedRoute({ children }) {
    const authContext = useAuth();

    if (authContext.isAuthenticated) {
        return children;
    }

    return <Navigate to="/" />;
}

export default function MainComponent() {
    return (
        <Routes>
            <Route path='/' element={<LoginComponent />} />
            <Route path='/request-account' element={<RequestAccountComponent />} />
            <Route path='/portfolio' element={
                <AuthenticatedRoute>
                    <PortfolioComponent />
                </AuthenticatedRoute>
            } />
            <Route path='/accounts/open-checking' element={
                <AuthenticatedRoute>
                    <OpenAccountComponent />
                </AuthenticatedRoute>
            } />
            <Route path='/accounts/open-savings' element={
                <AuthenticatedRoute>
                    <OpenSavingsComponent />
                </AuthenticatedRoute>
            } />
            <Route path='/accounts/delete' element={
                <AuthenticatedRoute>
                    <DeleteAccountComponent />
                </AuthenticatedRoute>
            } />
            <Route path='/cards/request-virtual' element={
                <AuthenticatedRoute>
                    <CreateVirtualCardComponent />
                </AuthenticatedRoute>
            } />
            <Route path='/payment/self' element={
                <AuthenticatedRoute>
                    <PaymentSelfComponent />
                </AuthenticatedRoute>
            } />
            <Route path='/payment/other' element={
                <AuthenticatedRoute>
                    <PaymentOtherComponent />
                </AuthenticatedRoute>
            } />
            <Route path='/exchange' element={
                <AuthenticatedRoute>
                    <ExchangeComponent />
                </AuthenticatedRoute>
            } />
            <Route path='/creditcard/reimburse' element={
                <AuthenticatedRoute>
                    <ReimburseComponent />
                </AuthenticatedRoute>
            } />
            <Route path='/account/customize' element={
                <AuthenticatedRoute>
                    <CustomizeAccountComponent />
                </AuthenticatedRoute>
            } />
            <Route path='/account/details' element={
                <AuthenticatedRoute>
                    <BankAccountDetailsComponent />
                </AuthenticatedRoute>
            } />
            <Route path='/card/details' element={
                <AuthenticatedRoute>
                    <CardDetailsComponent />
                </AuthenticatedRoute>
            } />
            <Route path='/reports' element={
                <AuthenticatedRoute>
                    <ReportsComponent />
                </AuthenticatedRoute>
            } />
            <Route path='/settings/password' element={
                <AuthenticatedRoute>
                    <PasswordComponent />
                </AuthenticatedRoute>
            } />
            <Route path='*' element={<ErrorComponent />} />
        </Routes>
    );
}