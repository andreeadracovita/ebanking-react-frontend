import { useIdleTimer } from 'react-idle-timer';
import { useLocation, useNavigate } from 'react-router';

import { useAuth } from '../security/AuthContext';

const whitelist = [
    '/',
    '/request-account'
]

/**
 * @param idleTime - number of seconds to wait before user is logged out
 */
const useIdleTimeout = ({ idleTime = 1 }) => {
    const idleTimeout = 1000 * idleTime;
    const authContext = useAuth();

    const location = useLocation();
    const navigate = useNavigate();

    const handleIdle = () => {
        let preventTimeout = false;
        for (const path of whitelist) {
            if (path === location.pathname) {
                preventTimeout = true;
            }
        }
        if (preventTimeout) {
            return;
        }
        authContext.logout();
        navigate('/');
        window.location.reload(false);
    };
    useIdleTimer({
        timeout: idleTimeout,
        onIdle: handleIdle
    });
    return;
}

export default useIdleTimeout;