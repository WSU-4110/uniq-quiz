import {Link} from 'react-router';
import {React, useState} from 'react';
import styles from "../Stylesheets/Global/Navbar.module.css";

export default function Navbar({isLoggedIn = false}){
    const [loginState, setLogin] = useState(isLoggedIn);
    const [sidebar, setSidebar] = useState(false);

    const links = [
        {text: "Dashboard", link:"/"},
        {text: "Play Game", link:"/join"},
        {text: "Decks", link:"/decks"},
        {text: "Study", link:"/"},
        {text: "Profile", link: "/"},
        {text: "Settings", link: "/settings"},
        {text: "Logout", link: "api/auth/signout"},
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
                        <li className={sidebar ? `${styles.menuItem}` : `${styles.menuItem} ${styles.menuItemNX}`}>
                            <Link to={link}>{text}</Link>
                        </li>
                    ))}
                </div>
            </div>
            <div className={styles.navFoot}>

            </div>
        </div>
    );
}