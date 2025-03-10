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
                console.log("Response is:", response);
                if (response.data.authenticated) {
                    console.log(`AuthContext.jsx: response was ${response.data.authenticated}`);
                    setIsAuthenticated(true);
                    setUser(response.data.user.id);
                } else {
                    console.log(`AuthContext.jsx: response was null`);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            } finally {
                console.log("AuthContext.jsx: finally block reached");
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if(isAuthenticated){
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