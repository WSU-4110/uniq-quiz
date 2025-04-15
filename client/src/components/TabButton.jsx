import styles from "../Stylesheets/Components/TabButton.module.css";

export default function TabButton({children, isSelected, ...props}){
    return(
        <li className={styles.tabButton}>
            <button className={isSelected ? 'active' : undefined} {...props}>{children}</button>
        </li>
    );
}