import { Navigate, Route, Routes } from 'react-router';

import { useAuth } from '../security/AuthContext';
import PortfolioComponent from '../portfolio/PortfolioComponent';
import ErrorComponent from '../ErrorComponent';
import ReportsComponent from '../ReportsComponent';
import ExchangeComponent from '../payments/ExchangeComponent';
import PaymentOtherComponent from '../payments/PaymentOtherComponent';
import PaymentSelfComponent from '../payments/PaymentSelfComponent';
import OpenAccountComponent from '../add/OpenAccountComponent';
import OpenSavingsComponent from '../add/OpenSavingsComponent';
import DeleteAccountComponent from '../DeleteAccountComponent';
import ReimburseComponent from '../payments/ReimburseComponent';
import CustomizeAccountComponent from '../CustomizeAccountComponent';
import BankAccountDetailsComponent from '../BankAccountDetailsComponent';
import CardDetailsComponent from '../CardDetailsComponent';
import PasswordComponent from '../PasswordComponent';

function AuthenticatedRoute({ children }) {
    const authContext = useAuth();

    if (authContext.isAuthenticated) {
        return children;
    }

    return <Navigate to="/" />;
}

export default function MainComponent() {
    return (
        <div className="p-5 col-8">
            <Routes>
                <Route path='/portfolio' element={
                    <AuthenticatedRoute>
                        <PortfolioComponent />
                    </AuthenticatedRoute>
                } />
                <Route path='/open-account' element={
                    <AuthenticatedRoute>
                        <OpenAccountComponent />
                    </AuthenticatedRoute>
                } />
                <Route path='/open-savings' element={
                    <AuthenticatedRoute>
                        <OpenSavingsComponent />
                    </AuthenticatedRoute>
                } />
                <Route path='/delete/account' element={
                    <AuthenticatedRoute>
                        <DeleteAccountComponent />
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
        </div>
    );
}