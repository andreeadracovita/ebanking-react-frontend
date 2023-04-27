import MainComponent from './MainComponent';
import SidebarComponent from './SidebarComponent';
import useIdleTimeout from './UseIdleTimeout';

export default function BodyComponent() {
    useIdleTimeout({idleTime: 300});

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <SidebarComponent />
                <MainComponent />
            </div>
        </div>
    );
}