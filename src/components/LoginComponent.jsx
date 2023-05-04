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
import { ErrorMessage } from './common/constants/Constants';

export default function LoginComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const authContext = useAuth();

    useEffect(() => {
        if (authContext.isAuthenticated) {
            navigate('/portfolio');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            setShowError(false);
            navigate(`/portfolio`);
        } else {
            setShowError(true);
        }
    }

    return (
        <div className="main-content">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Login eBanking</h1>
            <div className="d-flex">
                <span className="text-nowrap login-form">
                    <h1 className="h5 mb-5 fw-bold text-royal-blue">Enter your username and password</h1>
                    {showError && <div className="text-danger mb-3">{ErrorMessage.authentication}</div>}
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
                <span className="login-info">
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