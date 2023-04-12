import { BrowserRouter } from 'react-router-dom';

import AuthProvider from './security/AuthContext';
import BodyComponent from './common/BodyComponent';
import HeaderComponent from './common/HeaderComponent';
import FooterComponent from './common/FooterComponent';

export default function EBankingApp() {
    return (
        <div className="EBankingApp">
            <AuthProvider>
                <BrowserRouter>
                    <HeaderComponent/>
                    <BodyComponent/>
                    <FooterComponent/>
                </BrowserRouter>
            </AuthProvider>
        </div>
    );
}