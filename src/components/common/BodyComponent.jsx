import MainComponent from './MainComponent';
import SidebarComponent from './SidebarComponent';

export default function BodyComponent() {
    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <SidebarComponent />
                <MainComponent />
            </div>
        </div>
    );
}