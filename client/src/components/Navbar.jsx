import {Link, useNavigate} from 'react-router';
import React from 'react';
import { useAuth } from "../context/AuthContext";
import styles from "../Stylesheets/Components/Navbar.module.css";

export default function Navbar({sidebar, setSidebar, isLoggedIn = false}){
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    const links = [
        {text: "Dashboard", link:"/dashboard"},
        {text: "Play", link:"/join"},
        {text: "Decks", link:"/decks"},
        {text: "Study", link:"/"},
        {text: "Profile", link: "/profile"},
        {text: "Settings", link: "/settings"},
    ];

    function showSidebar(){ setSidebar(!sidebar); }

    return(
        <div className={sidebar ? `${styles.sideNavContainer}` : `${styles.sideNavContainer} ${styles.sideNavContainerNX}`}>
            <div className={styles.navMain}>
                <div className={styles.navHeader}>
                    {sidebar && (
                        <div className={styles.navLogo}>
                            <h2>UniqQuiz</h2>
                        </div>
                    )}
                    <button className={sidebar ? `${styles.menuIn}` : `${styles.menuOut}`}
                            onClick={showSidebar}>
                            <span></span>
                            <span></span>
                            <span></span>
                    </button>
                </div>
                <div className={styles.navMenu}>
                    {links.map(({text, link}) => (
                        <li key={text} className={sidebar ? `${styles.menuItem}` : `${styles.menuItem} ${styles.menuItemNX}`}>
                            <Link to={link}>{text}</Link>
                        </li>
                    ))}
                    {isAuthenticated && (
                        <li className={sidebar ? `${styles.menuItem}` : `${styles.menuItem} ${styles.menuItemNX}`}>
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                    )}
                </div>
            </div>
            <div className={styles.navFoot}>

            </div>
        </div>
    );
}