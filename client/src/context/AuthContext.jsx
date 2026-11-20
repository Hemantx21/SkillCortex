import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        setLoading(false);
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }, []);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);

            // Verify token and fetch user
            axios.get('/api/auth/me')
                .then(res => {
                    setUser(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Token invalid", err);
                    logout();
                });
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token, logout]);

    const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (name, email, password, role, phone, captchaId, captchaAnswer) => {
        const res = await axios.post('/api/auth/register', { name, email, password, role, phone, captchaId, captchaAnswer });
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
