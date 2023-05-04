import { useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';

import { checkPasscodeInput } from './common/helpers/HelperFunctions';
import { updateUserPasscodeApi } from './api/EBankingApiService';
import { useAuth } from './security/AuthContext';
import { ComponentState } from './common/constants/Constants';

export default function PasswordComponent() {
    const [componentState, setComponentState] = useState(ComponentState.form);
    const [newPasscode, setNewPasscode] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    function onSubmitForm() {
        if (newPasscode.length !== 5) {
            setShowError(true);
            return;
        }

        const payload = {
            passcode: newPasscode
        };
        updateUserPasscodeApi(username, payload)
            .then(() => {
                handlePasscodeChanged();
            })
            .catch(error => {
                console.log(error);
                setShowServerError(true);
            });
    }

    async function handlePasscodeChanged() {
        if (await authContext.login(username, newPasscode)) {
            setComponentState(ComponentState.success);
        } else {
            setShowServerError(true);
        }
    }

    function onPortfolioRedirect() {
        navigate('/portfolio');
    }

    return (
        <div className="main-content">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Change eBanking passcode</h1>

            {
                componentState === ComponentState.form &&
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div>
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

                
                        <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-5">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={newPasscode}
                                onChange={handleNewPasscodeChange}
                                onKeyDown={checkPasscodeInput}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                        <br/>
                        <button className="btn btn-royal-blue btn-form mb-3" type="button" name="submit" onClick={onSubmitForm}>Save changes</button>
                        <br/>
                        <button className="btn btn-secondary btn-form" type="button" name="cancel" onClick={onPortfolioRedirect}>Cancel</button>
                    </div>
                </Box>
            }
            {
                componentState === ComponentState.success &&
                <div className="fw-bold">
                    <p className='mb-5'>Password successfully changed.</p>
                    <button className="btn btn-royal-blue btn-form mb-3" type="button" name="back" onClick={onPortfolioRedirect}>To portfolio</button>
                </div>
            }
        </div>
    );
}