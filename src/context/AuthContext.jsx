/*
 * This context manages authentication state globally
 * throughout the DreamCart frontend.
 */

import {
    createContext,
    useContext,
    useState
} from "react";

import authService from "../services/authService";


/*
 * Create the authentication context.
 */
const AuthContext = createContext(null);


export function AuthProvider({ children }) {


    /*
     * Check whether a JWT token already exists
     * when the application starts.
     */
    const [isAuthenticated, setIsAuthenticated] =
        useState(
            authService.isAuthenticated()
        );


    /*
     * Handles user login.
     *
     * authService.login():
     * 1. Sends credentials to the backend.
     * 2. Receives JWT token.
     * 3. Stores token in localStorage.
     *
     * Then we update the global authentication state.
     */
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


        return response;
    };


    /*
     * Handles user registration.
     *
     * The backend returns a JWT token
     * after successful registration.
     */
    const register = async (
        userData
    ) => {

        const response =
            await authService.register(
                userData
            );


        /*
         * IMPORTANT:
         *
         * The correct property is:
         *
         * response.token
         *
         * NOT:
         *
         * response.toekn
         */
        if (response.token) {

            localStorage.setItem(
                "token",
                response.token
            );


            setIsAuthenticated(true);
        }


        return response;
    };


    /*
     * Logs out the current user.
     */
    const logout = () => {

        authService.logout();


        setIsAuthenticated(false);
    };


    return (

        <AuthContext.Provider
            value={{

                isAuthenticated,

                login,

                register,

                logout

            }}
        >

            {children}

        </AuthContext.Provider>

    );
}


/*
 * Custom hook used by components
 * to access authentication functions
 * and state.
 */
export function useAuth() {

    return useContext(
        AuthContext
    );

}