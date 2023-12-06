import React, { createContext, useState, useContext, useCallback } from 'react';

// Create a Context for the user data
export const UserContext = createContext();

// Create a Provider Component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState(null);

    // Function to handle login
    const login = useCallback(async (User_id, Password) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ User_id, Password }),
            });

            const data = await response.json();

            if (response.ok) {
                //const data = await response.json();
                setUser(User_id); 
                setPassword(Password);
                console.log(data)
                return { success: true, message: data['message'] };
            } else {
                return { success: false, message: data.message || 'Invalid credentials' };
            }
        } catch (error) {
            console.error('Login Error:', error);
            return { success: false, message: 'Login Error: ' + error.message };
        }
    }, []);

    // Function to handle logout
    const logout = useCallback(() => {
        setUser(null);
        setPassword(null);
    }, []);

    // The value that will be given to the context
    const value = {
        user,
        password,
        login,
        logout
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);
