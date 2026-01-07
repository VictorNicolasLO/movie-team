
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
    const [roomKey, setRoomKey] = useState(() => localStorage.getItem('roomKey') || '');
    const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

    useEffect(() => {
        localStorage.setItem('username', username);
    }, [username]);

    useEffect(() => {
        localStorage.setItem('roomKey', roomKey);
    }, [roomKey]);

    useEffect(() => {
        localStorage.setItem('isAdmin', isAdmin);
    }, [isAdmin]);

    const login = (name, key, admin = false) => {
        setUsername(name);
        setRoomKey(key);
        setIsAdmin(admin);
    };

    const logout = () => {
        setUsername('');
        setRoomKey('');
        setIsAdmin(false);
        localStorage.removeItem('username');
        localStorage.removeItem('roomKey');
        localStorage.removeItem('isAdmin');
    };

    return (
        <AuthContext.Provider value={{ username, roomKey, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
