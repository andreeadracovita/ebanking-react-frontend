import { createContext, useContext, useEffect, useState } from 'react';

import { apiClient } from '../api/ApiClient';
import { executeJwtAuthenticationService } from '../api/AuthenticationApiService';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState();
    const [token, setToken] = useState();

    useEffect(() => {
        var newIsAuthenticated = sessionStorage.getItem("isAuthenticated");
        if (newIsAuthenticated !== null) {
            setAuthenticated(newIsAuthenticated);
            setUsername(sessionStorage.getItem("username"));
            const jwtToken = sessionStorage.getItem("token");
            setToken(jwtToken);
            apiClient.interceptors.request.use(
                (config) => {
                    console.log('intercepting and adding a token');
                    config.headers.Authorization = jwtToken;
                    return config;
                }
            )
        }
    }, []);

    async function login(username, password) {
        try {
            const response = await executeJwtAuthenticationService(username, password);

            if (response.status === 200) {
                const jwtToken = 'Bearer ' + response.data.token;
                setAuthenticated(true);
                sessionStorage.setItem("isAuthenticated", true);

                setUsername(username);
                sessionStorage.setItem("username", username);

                setToken(jwtToken);
                sessionStorage.setItem("token", jwtToken);

                apiClient.interceptors.request.use(
                    (config) => {
                        console.log('intercepting and adding a token');
                        config.headers.Authorization = jwtToken;
                        return config;
                    }
                )
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    function logout() {
        setAuthenticated(false);
        sessionStorage.removeItem("isAuthenticated");

        setUsername(null);
        sessionStorage.removeItem("username");

        setToken(null);
        sessionStorage.removeItem("token");

        window.location.reload(false);
    }

    return (
        <AuthContext.Provider value={ { isAuthenticated, login, logout, username, token} }>
            {children}
        </AuthContext.Provider>
    );
}