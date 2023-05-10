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
import { ComponentState, MAX_NAME_LENGTH, OASI_LENGTH, PASSCODE_LENGTH } from './common/constants/Constants';
import { checkValidUsernameApi, createUserAccountApi } from './api/EBankingApiService';

export default function RequestAccountComponent() {
    const emptyForm = {
        firstName: '',
        lastName: '',
        OASI: '',
        username: '',
        passcode: ''
    };

    const errorFields = {
        firstName: false,
        lastName: false,
        OASI: false,
        username: false,
        passcode: false
    }

    const [componentState, setComponentState] = useState(ComponentState.form);
    const [form, setForm] = useState(emptyForm);
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setShowError] = useState(errorFields);
    const [responseErrorMessage, setResponseErrorMessage] = useState('');
    const [usernameError, setUsernameError] = useState(false);

    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    function handleFirstNameChange(event) {
        if (event.target.value.length <= MAX_NAME_LENGTH) {
            setForm(prevState => ({...prevState, firstName: event.target.value}));
        }
    }

    function handleLastNameChange(event) {
        if (event.target.value.length <= MAX_NAME_LENGTH) {
            setForm(prevState => ({...prevState, lastName: event.target.value}));
        }
    }

    function handleOASIChange(event) {
        if (event.target.value.length <= OASI_LENGTH) {
            setForm(prevState => ({...prevState, OASI: event.target.value}));
        }
    }

    function handleUsernameChange(event) {
        if (event.target.value.length <= MAX_NAME_LENGTH) {
            setForm(prevState => ({...prevState, username: event.target.value}));
        }
    }

    function handlePasscodeChange(event) {
        if (event.target.value.length <= PASSCODE_LENGTH) {
            setForm(prevState => ({...prevState, passcode: event.target.value}));
        }
    }

    function goToConfirm() {
        if (!validForm()) {
            return;
        }

        const payload = {
            usernameToCheck: form.username
        };
        checkValidUsernameApi(payload)
            .then(() => {
                setComponentState(ComponentState.confirm);
                setUsernameError(false);
            })
            .catch(() => {
                setUsernameError(true);
            });
    }

    function backToForm() {
        setComponentState(ComponentState.form);
    }

    function handleSubmit() {
        createUserAccountApi(form)
            .then(() => {
                setComponentState(ComponentState.success);
            })
            .catch(error => {
                setResponseErrorMessage(error.response.data);
                setComponentState(ComponentState.failure);
            });
    }

    function validForm() {
        var valid = true;

        setShowError(prevValue => ({...prevValue, firstName: form.firstName.length === 0 || form.firstName.length > MAX_NAME_LENGTH}));
        valid = valid && form.firstName.length !== 0 && form.firstName.length <= MAX_NAME_LENGTH;

        setShowError(prevValue => ({...prevValue, lastName: form.lastName.length === 0 || form.lastName.length > MAX_NAME_LENGTH}));
        valid = valid && form.lastName.length !== 0 && form.lastName.length <= MAX_NAME_LENGTH;

        setShowError(prevValue => ({...prevValue, OASI: form.OASI.length !== OASI_LENGTH}));
        valid = valid && form.OASI.length === OASI_LENGTH;

        setShowError(prevValue => ({...prevValue, username: form.username.length === 0 || form.username.length > MAX_NAME_LENGTH}));
        valid = valid && form.username.length !== 0 && form.username.length <= MAX_NAME_LENGTH;

        setShowError(prevValue => ({...prevValue, passcode: form.passcode.length !== PASSCODE_LENGTH}));
        valid = valid && form.passcode.length === PASSCODE_LENGTH;

        return valid;
    }

    function onLoginRedirect() {
        navigate('/');
    }

    return (
        <div className="main-content">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Request new eBanking account</h1>
            {
                (componentState === ComponentState.form || componentState === ComponentState.confirm) &&
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div>
                        {
                            showError.firstName &&
                            <div className="text-danger mb-2">
                                <p>First name must not be empty.</p>
                            </div>
                        }
                        <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-5">
                            <InputLabel htmlFor="outlined-adornment-first">First name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-first"
                                type='text'
                                value={form.firstName}
                                onChange={handleFirstNameChange}
                                label="First name"
                                disabled={componentState === ComponentState.confirm}
                            />
                        </FormControl>
                        <br/>
                        {
                            showError.lastName &&
                            <div className="text-danger mb-2">
                                <p>Last name must not be empty.</p>
                            </div>
                        }
                        <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-5">
                            <InputLabel htmlFor="outlined-adornment-last">Last name</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-last"
                                type='text'
                                value={form.lastName}
                                onChange={handleLastNameChange}
                                label="Last name"
                                disabled={componentState === ComponentState.confirm}
                            />
                        </FormControl>
                        <br/>
                        {
                            showError.OASI &&
                            <div className="text-danger mb-2">
                                <p>OASI must have 13 digits.</p>
                            </div>
                        }
                        <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-5">
                            <InputLabel htmlFor="outlined-adornment-oasi">OASI</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-oasi"
                                type='text'
                                value={form.OASI}
                                onChange={handleOASIChange}
                                onKeyDown={checkPasscodeInput}
                                label="OASI"
                                disabled={componentState === ComponentState.confirm}
                            />
                        </FormControl>
                        <br/>
                        {
                            showError.username &&
                            <div className="text-danger mb-2">
                                <p>Username must not be empty.</p>
                            </div>
                        }
                        {
                            usernameError &&
                            <div className="text-danger mb-2">
                                <p>Username is already taken.</p>
                            </div>
                        }
                        <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-5">
                            <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-username"
                                type='text'
                                value={form.username}
                                onChange={handleUsernameChange}
                                label="Username"
                                disabled={componentState === ComponentState.confirm}
                            />
                        </FormControl>
                        <br/>
                        {
                            showError.passcode &&
                            <div className="text-danger mb-2">
                                <p>Passcode must have 5 digits.</p>
                            </div>
                        }
                        <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-5">
                            <InputLabel htmlFor="outlined-adornment-password">Passcode</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.passcode}
                                onChange={handlePasscodeChange}
                                onKeyDown={checkPasscodeInput}
                                disabled={componentState === ComponentState.confirm}
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
                        {
                            componentState === ComponentState.form &&
                            <button className="btn btn-royal-blue btn-form" type="button" onClick={goToConfirm}>Next</button>
                        }
                        {
                            componentState === ComponentState.confirm &&
                            <span>
                                <button className="btn btn-royal-blue btn-form mb-3" type="button" onClick={handleSubmit}>Confirm</button>
                                <br/>
                                <button className="btn btn-royal-blue btn-form" type="button" onClick={backToForm}>Back</button>
                            </span>
                            
                        }
                        
                    </div>
                </Box>
            }
            {
                componentState === ComponentState.success &&
                <div className="fw-bold">
                    <p className="mb-5">User account successfully created.</p>
                    <button className="btn btn-royal-blue btn-form mb-3" type="button" onClick={onLoginRedirect}>To login</button>
                </div>
            }
            {
                componentState === ComponentState.failure &&
                <div className="fw-bold">
                    <p className="mb-5">User account creation failed.</p>
                    <p className="mb-5">{responseErrorMessage}.</p>
                    <button className="btn btn-royal-blue btn-form mb-3" type="button" onClick={onLoginRedirect}>To login</button>
                </div>
            }
        </div>
    );
}