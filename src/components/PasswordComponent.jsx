import { useState } from 'react';
import { useNavigate } from 'react-router';

import { checkPasscodeInput } from './common/helpers/HelperFunctions';
import { updateUserPasscodeApi } from './api/EBankingApiService';
import { useAuth } from './security/AuthContext';

export default function PasswordComponent() {
    const [changeState, setChangeState] = useState('form');
    const [newPasscode, setNewPasscode] = useState('');
    const [newPasscodeRepeat, setNewPasscodeRepeat] = useState('');

    const [showError, setShowError] = useState(false);
    const [showServerError, setShowServerError] = useState(false);

    const navigate = useNavigate();

    const authContext = useAuth();
    const username = authContext.username;

    function handleNewPasscodeChange(event) {
        if (event.target.value.length <= 5) {
            setNewPasscode(event.target.value);
        } else {
            event.preventDefault();
        }
    }

    function handleNewPasscodeRepeatChange(event) {
        if (event.target.value.length <= 5) {
            setNewPasscodeRepeat(event.target.value);
        } else {
            event.preventDefault();
        }
    }

    function onSubmitForm() {
        console.log(newPasscode);
        console.log(newPasscodeRepeat);
        if (newPasscode == null || newPasscodeRepeat == null || newPasscode != newPasscodeRepeat || newPasscode.length != 5) {
            setShowError(true);
            return;
        }
        // setChangeState('success');

        const payload = {
            passcode: newPasscode
        };
        updateUserPasscodeApi(username, payload)
            .then(response => {
                console.log(response);
                handlePasscodeChanged();
            })
            .catch(error => {
                console.log(error);
                setShowServerError(true);
            });
    }

    async function handlePasscodeChanged() {
        if (await authContext.login(username, newPasscode)) {
            setChangeState('success');
        } else {
            setShowServerError(true);
        }
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    return (
        <div>
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Change eBanking passcode</h1>

            {
                changeState === 'form' &&
                <form>
                    { 
                        showError &&
                        <div className="mb-5">
                            <p className="text-danger mb-3">Fields must match.</p>
                            <p className="text-danger">Passcode must be 5 digits long.</p>
                        </div>
                    }
                    { 
                        showServerError &&
                        <div className="mb-5">
                            <p className="text-danger mb-3">Server-side error.</p>
                        </div>
                    }
                    <div className="mb-5">
                        <input className="input-field mb-3" type="text" name="newPasscode" placeholder="New passcode" value={newPasscode} onChange={handleNewPasscodeChange} onKeyDown={checkPasscodeInput}/>
                        <br/>
                        <input className="input-field" type="text" name="newPasscodeRepeat" placeholder="Repeat new passcode" value={newPasscodeRepeat} onChange={handleNewPasscodeRepeatChange} onKeyDown={checkPasscodeInput}/>
                    </div>
                    <div>
                        <button className="btn btn-royal-blue px-5 mb-3" type="button" name="submit" onClick={onSubmitForm}>Save changes</button>
                        <br/>
                        <button className="btn btn-secondary px-5" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                    </div>
                </form>
            }
            {
                changeState === 'success' &&
                <div className="fw-bold">
                    <p className='mb-5'>Password successfully changed.</p>
                    <button className="btn btn-royal-blue px-5 mb-3" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}