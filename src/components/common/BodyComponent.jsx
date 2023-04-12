import MainComponent from './MainComponent';
import { useAuth } from '../security/AuthContext';
import SidebarComponent from './SidebarComponent';

export default function BodyComponent() {
    const authContext = useAuth();
    const isAuthenticated = authContext.isAuthenticated;

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                {isAuthenticated && <SidebarComponent/>}
                <MainComponent/>
            </div>
        </div>
    );
}