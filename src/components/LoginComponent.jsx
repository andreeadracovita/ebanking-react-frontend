import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
        <div className="main-content">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Login eBanking</h1>
            <div className="d-flex">
                <span className="text-nowrap">
                    <h1 className="h5 mb-5 fw-bold text-royal-blue">Enter your username and password</h1>
                    {showErrorMessage && <div className="text-danger mb-3">Authentication failed. Please check your credentials.</div>}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div>
                            <FormControl sx={{ width: '38ch' }} variant="outlined" className="mb-5">
                                <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-username"
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
                            <button className="btn btn-royal-blue btn-form" type="button" name="login" onClick={handleSubmit}>Next</button>
                        </div>
                    </Box>
                </span>
                <span className="sidebar d-block h-auto"></span>
                <span className="bg-light-royal-blue text-royal-blue">
                    <div className="m-5">
                        <p className="fw-bold">Not using WorldBank eBanking yet?</p>
                        <p>→ View transaction reports anytime, anywhere</p>
                        <p>→ Make payments at home</p>
                        <p>→ Open accounts at home</p>
                        <br/>
                        <Link className="text-royal-blue fw-bold" to="/request-account">Request an account</Link>
                    </div>
                </span>
            </div>
        </div>
    );
}