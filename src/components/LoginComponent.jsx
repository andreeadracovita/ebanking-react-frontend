import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';

import { useAuth } from './security/AuthContext';
import { checkPasscodeInput } from './common/helpers/HelperFunctions';

export default function LoginComponent() {
    const [username, setUsername] = useState('user');
    const [password, setPassword] = useState('12345');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const authContext = useAuth();

    useEffect(() => {
        if (authContext.isAuthenticated) {
            navigate('/portfolio');
        }
    }, []);

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div>
                                <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-4">
                                    <InputLabel htmlFor="outlined-adornment-password">Username</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type='text'
                                        value={username}
                                        onChange={handleUsernameChange}
                                        label="Username"
                                    />
                                </FormControl>
                                <br/>
                                <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-5">
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={handlePasswordChange}
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
                                <button className="btn btn-royal-blue px-5" type="button" name="login" onClick={handleSubmit}>Next</button>
                            </div>
                        </Box>
                    </div>
                    <div className="d-none d-xl-block bg-light-royal-blue" style={{width: 442 + 'px'}}>
                        <div className="m-4">
                            <p className="fw-bold">Account for testing purposes</p>
                            <p>Username: user</p>
                            <p>Password: 12345</p>
                            <br/>
                            <p className="fw-bold">Not using eBanking yet?</p>
                            <p>- Access transactions and reports anytime, anywhere</p>
                            <p>- Make Payments at home</p>
                            <p>- Open accounts at home</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}