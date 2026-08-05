/*
 * This context manages authentication state globally throughout
 * the DreamCart frontend.
 */

import {
    createContext,
    useContext,
    useState
} from "react";

import authService from "../services/authService";

const AuthContext = createContext();


export function AuthProvider({ children }) {

    const [
        isAuthenticated,
        setIsAuthenticated
    ] = useState(
        authService.isAuthenticated()
    );


    const [
        role,
        setRole
    ] = useState(
        authService.getRole()
    );


    const login = async (
        email,
        password
    ) => {

        const response =
            await authService.login(
                email,
                password
            );

        setIsAuthenticated(true);

        setRole(
            response.role
        );

        return response;
    };


    const register = async (
        userData
    ) => {

        const response =
            await authService.register(
                userData
            );

        setIsAuthenticated(true);

        setRole(
            response.role
        );

        return response;
    };


    const logout = () => {

        authService.logout();

        setIsAuthenticated(false);

        setRole(null);
    };


    return (

        <AuthContext.Provider
            value={{
                isAuthenticated,
                role,
                login,
                register,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(
        AuthContext
    );
}