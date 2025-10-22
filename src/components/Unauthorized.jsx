import { useNavigate } from 'react-router-dom';
import { BiError, BiHome, BiLogOut } from 'react-icons/bi';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

/**
 * Unauthorized Access Page
 * 
 * This page is displayed when a user tries to access a resource
 * they don't have permission for.
 */
const Unauthorized = ({ 
    title = "Access Denied",
    message = "You do not have permission to access this page.",
    showReturnButton = true 
}) => {
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();

    const handleLogout = async () => {
        try {
            await axios.get('http://localhost/api/Logout.php', { withCredentials: true });
            setAuth({});
            navigate('/login');
        } catch (err) {
            console.error("Logout failed", err);
            navigate('/login');
        }
    };

    const goToDashboard = () => {
        navigate('/DashboardAlt');
    };

    const goBack = () => {
        navigate(-1);
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#DDE6ED',
        padding: '2rem'
    };

    const contentStyle = {
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '3px solid #27374D',
        padding: '3rem',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    };

    const iconStyle = {
        fontSize: '80px',
        color: '#dc3545',
        marginBottom: '1.5rem'
    };

    const titleStyle = {
        color: '#27374D',
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    };

    const messageStyle = {
        color: '#666',
        fontSize: '1.1rem',
        marginBottom: '2rem',
        lineHeight: '1.6'
    };

    const userInfoStyle = {
        backgroundColor: '#DDE6ED',
        padding: '1rem',
        borderRadius: '4px',
        marginBottom: '2rem',
        border: '2px solid #27374D'
    };

    const infoTextStyle = {
        color: '#27374D',
        fontSize: '0.95rem',
        margin: '0.5rem 0',
        fontWeight: '600'
    };

    const actionsStyle = {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '2rem'
    };

    const buttonBaseStyle = {
        padding: '0.75rem 1.5rem',
        border: '2px solid #27374D',
        borderRadius: '50px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.3s ease',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    };

    const primaryButtonStyle = {
        ...buttonBaseStyle,
        backgroundColor: '#27374D',
        color: '#fff'
    };

    const secondaryButtonStyle = {
        ...buttonBaseStyle,
        backgroundColor: '#fff',
        color: '#27374D'
    };

    const logoutButtonStyle = {
        ...buttonBaseStyle,
        backgroundColor: '#dc3545',
        color: '#fff',
        borderColor: '#dc3545'
    };

    const helpSectionStyle = {
        borderTop: '2px solid #27374D',
        paddingTop: '2rem',
        marginTop: '2rem'
    };

    const helpTitleStyle = {
        color: '#27374D',
        fontSize: '1.2rem',
        fontWeight: '700',
        marginBottom: '1rem',
        textTransform: 'uppercase'
    };

    const helpTextStyle = {
        color: '#666',
        fontSize: '0.95rem',
        marginBottom: '0.75rem'
    };

    const errorCodeStyle = {
        backgroundColor: '#27374D',
        color: '#fff',
        padding: '0.25rem 0.75rem',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '0.9rem',
        fontWeight: '700'
    };

    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <div>
                    <BiError style={iconStyle} />
                </div>
                
                <h1 style={titleStyle}>{title}</h1>
                
                <p style={messageStyle}>{message}</p>
                
                {auth?.adminID && (
                    <div style={userInfoStyle}>
                        <p style={infoTextStyle}>
                            You are logged in as: <strong>{auth.adminID}</strong>
                        </p>
                        <p style={infoTextStyle}>
                            Role Code: <strong>{auth.roles?.[0] || 'Unknown'}</strong>
                        </p>
                    </div>
                )}
                
                <div style={actionsStyle}>
                    {showReturnButton && (
                        <button onClick={goBack} style={secondaryButtonStyle}>
                            Go Back
                        </button>
                    )}
                    
                    <button onClick={goToDashboard} style={primaryButtonStyle}>
                        <BiHome size={20} />
                        Dashboard
                    </button>
                    
                    <button onClick={handleLogout} style={logoutButtonStyle}>
                        <BiLogOut size={20} />
                        Logout
                    </button>
                </div>
                
                <div style={helpSectionStyle}>
                    <h3 style={helpTitleStyle}>Need Access?</h3>
                    <p style={helpTextStyle}>
                        If you believe you should have access to this page, please contact your system administrator.
                    </p>
                    <p style={helpTextStyle}>
                        Error Code: <span style={errorCodeStyle}>ERR_403_FORBIDDEN</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;