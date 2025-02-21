import {Link} from 'react-router-dom';
import styles from '../../Stylesheets/Home/Landing.module.css';

const links = [
    {text: "JOIN GAME", link:"/join"},
    {text: "Login", link:"/login"},
    {text: "Signup", link:"/signup"},
];

export default function Landing(){
    return(
        <div className={styles.landing}>
            <div className={styles.header}>
                <img src="/TitleLogo.svg" alt="Uniq-Quiz Logo" />
            </div>
            <div className={styles.logo}>
                <img src="/Logo.svg" alt="Uniq-Quiz Logo" />
            </div>
            <div className={styles.landingMenu}>
                {links.map(({text, link}) => (
                    <li className={styles.menuItem}>
                        <Link to={link}><h1>{text}</h1></Link>
                    </li>
                ))}
            </div>
        </div>
    );
}