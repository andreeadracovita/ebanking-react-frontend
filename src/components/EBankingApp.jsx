import { BrowserRouter } from "react-router-dom"
import FooterComponent from "./FooterComponent"
import HeaderComponent from "./HeaderComponent"
import AuthProvider from "./security/AuthContext"
import BodyComponent from './BodyComponent'

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
    )
}