import { Route, Routes, useNavigate } from 'react-router';

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
import React, { useEffect, useState } from 'react';

const ProtectedRoute = (props) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const checkUserToken = () => {
        const userToken = sessionStorage.getItem('token');
        if (!userToken || userToken === 'undefined') {
            setIsLoggedIn(false);
            return navigate('/');
        }
        setIsLoggedIn(true);
    }
    useEffect(() => {
            checkUserToken();
        }, [isLoggedIn]);
    return (isLoggedIn ? props.children : null);
}

export default function MainComponent() {
    return (
        <Routes>
            <Route path='/' element={<LoginComponent />} />
            <Route path='/request-account' element={<RequestAccountComponent />} />
            <Route path='/portfolio' element={
                <ProtectedRoute>
                    <PortfolioComponent />
                </ProtectedRoute>
            } />
            <Route path='/accounts/open-checking' element={
                <ProtectedRoute>
                    <OpenAccountComponent />
                </ProtectedRoute>
            } />
            <Route path='/accounts/open-savings' element={
                <ProtectedRoute>
                    <OpenSavingsComponent />
                </ProtectedRoute>
            } />
            <Route path='/accounts/delete' element={
                <ProtectedRoute>
                    <DeleteAccountComponent />
                </ProtectedRoute>
            } />
            <Route path='/cards/request-virtual' element={
                <ProtectedRoute>
                    <CreateVirtualCardComponent />
                </ProtectedRoute>
            } />
            <Route path='/payment/self' element={
                <ProtectedRoute>
                    <PaymentSelfComponent />
                </ProtectedRoute>
            } />
            <Route path='/payment/other' element={
                <ProtectedRoute>
                    <PaymentOtherComponent />
                </ProtectedRoute>
            } />
            <Route path='/exchange' element={
                <ProtectedRoute>
                    <ExchangeComponent />
                </ProtectedRoute>
            } />
            <Route path='/creditcard/reimburse' element={
                <ProtectedRoute>
                    <ReimburseComponent />
                </ProtectedRoute>
            } />
            <Route path='/account/customize' element={
                <ProtectedRoute>
                    <CustomizeAccountComponent />
                </ProtectedRoute>
            } />
            <Route path='/account/details' element={
                <ProtectedRoute>
                    <BankAccountDetailsComponent />
                </ProtectedRoute>
            } />
            <Route path='/card/details' element={
                <ProtectedRoute>
                    <CardDetailsComponent />
                </ProtectedRoute>
            } />
            <Route path='/reports' element={
                <ProtectedRoute>
                    <ReportsComponent />
                </ProtectedRoute>
            } />
            <Route path='/settings/password' element={
                <ProtectedRoute>
                    <PasswordComponent />
                </ProtectedRoute>
            } />
            <Route path='*' element={<ErrorComponent />} />
        </Routes>
    );
}