import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("/api/auth/session", { withCredentials: true });
                if (response.data.authenticated) {
                    setIsAuthenticated(true);
                    setUser(response.data.user.id);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            } finally { 
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if(isAuthenticated){
            const fetchUserName = async () => {
                try {
                    const response = await axios.get(`/api/users/${user}` , { withCredentials: true });
                    setUserName(response.data.Username);
                    console.log(response.data);
                } catch (err) {
                    console.error("Error fetching user:", err);
                }
            };
            fetchUserName();
        }
    }, [isAuthenticated]);

    const login = async (email, password) => {
        try {
            const response = await axios.post("/api/auth/login", { email, password }, { withCredentials: true });

            if (response.data.error) {
                return { error: response.data.error };
            }

            setIsAuthenticated(true);
            setUser(response.data.data.user.id);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { error: "Something went wrong." };
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/auth/signout", {}, { withCredentials: true });
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user, userName, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}