import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from './security/AuthContext';

export default function LoginComponent() {
    const [username, setUsername] = useState('user');
    const [password, setPassword] = useState('12345');
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const navigate = useNavigate();
    const authContext = useAuth();

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    async function handleSubmit() {
        if (await authContext.login(username, password)) {
            setShowErrorMessage(false);
            navigate(`/portfolio`);
        } else {
            setShowErrorMessage(true);
        }
    }

    return (
        <div className="row">
            <div className="sidebar"></div>
            <div className="col-9 text-nowrap">
                <h1 className="h2 mb-5 text-royal-blue fw-bold">Login eBanking</h1>
                <div className="row text-royal-blue flex-nowrap">
                    <div className="d-block">
                        <h1 className="h5 mb-5 fw-bold">Enter your username and password</h1>
                        {showErrorMessage && <div className="errorMessage">Authentication failed. Please check your credentials.</div>}
                        <form>
                            <div className="mb-5">
                                <input className="input-field" type="text" name="username" placeholder="Username" value={username} onChange={handleUsernameChange} />
                                <p className="fw-bold">Example: c1234567</p>
                            </div>
                            <div className="mb-5">
                                <input className="input-field" type="password" name="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                            </div>
                            <p className="text-decoration-underline fw-bold mb-5">Forgot your password?</p>
                            <div>
                                <button className="btn btn-royal-blue px-5" type="button" name="login" onClick={handleSubmit}>Next</button>
                            </div>
                        </form>
                    </div>
                    <div className="d-none d-xl-block bg-light-royal-blue" style={{width: 428 + 'px'}}>
                        <div className="mx-3 mt-3 mb-3">
                            <p className="fw-bold">Account for testing purposes</p>
                            <p>Username: user</p>
                            <p>Password: 12345</p>
                            <br/>
                            <p className="fw-bold">Not using eBanking yet?</p>
                            <p>- Access transactions and reports anytime, anywhere</p>
                            <p>- Make Payments at home</p>
                            <p>- Open accounts at home</p>
                            <br/>
                            <p className="text-decoration-underline">Find out more [Link here]</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}