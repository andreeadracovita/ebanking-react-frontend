import { BrowserRouter } from 'react-router-dom';

import AuthProvider from './security/AuthContext';
import BodyComponent from './common/BodyComponent';
import FooterComponent from './common/FooterComponent';

export default function EBankingApp() {
    return (
        <div className="EBankingApp">
            <AuthProvider>
                <BrowserRouter>
                    <BodyComponent />
                    <FooterComponent />
                </BrowserRouter>
            </AuthProvider>
        </div>
    );
}