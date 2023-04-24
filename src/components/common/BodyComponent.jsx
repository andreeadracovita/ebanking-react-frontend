import { Route, Routes } from 'react-router';

import MainComponent from './MainComponent';
import { useAuth } from '../security/AuthContext';
import SidebarComponent from './SidebarComponent';
import LoginComponent from '../LoginComponent';

export default function BodyComponent() {
    const authContext = useAuth();
    const isAuthenticated = authContext.isAuthenticated;

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <Routes>
                    <Route path='/' element={<LoginComponent />} />
                </Routes>
                {isAuthenticated && <SidebarComponent />}
                <MainComponent />
            </div>
        </div>
    );
}