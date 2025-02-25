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
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await axios.get('/api/auth/getdisplayname' , { withCredentials: true });
                setUserName(response.data.display_name);
                console.log(response.data);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };
        fetchUserName();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post("/api/auth/login", { email, password }, { withCredentials: true });

            if (response.data.error) {
                return { error: response.data.error };
            }

            setIsAuthenticated(true);
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