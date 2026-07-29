import styles from './Header.module.css';
import useAuth from '../../hooks/useAuth';
import EmergencyButton from '../../components/EmergencyButton';
import ProfileDropdown from '../../components/ProfileDropdown';

export default function Header({ title }) {
    const { auth } = useAuth();

    return(
        <div className={styles.header}>
            <div className={styles.headerLeft}>
                <h1 className={styles.title}>{title}</h1>
            </div>
            <div className={styles.headerRight}>
                <EmergencyButton />
                <ProfileDropdown
                    email={auth.userEmail || "Email"}
                    name= {auth.userFirstName + " " + auth.userLastName || "User"}
                />
            </div>
        </div>
    );
}

