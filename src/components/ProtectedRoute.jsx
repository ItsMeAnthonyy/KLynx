import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/rolePermissions';
import Unauthorized from './Unauthorized';

/**
 * ProtectedRoute Component
 * 
 * Wrapper component that checks if user has required permissions before rendering children.
 * Redirects to Unauthorized page if user lacks permissions.
 * 
 * @param {string|string[]} permission - Single permission or array of permissions required
 * @param {boolean} requireAll - If true and permission is array, user must have ALL permissions
 * @param {boolean} requireAuth - If true, user must be authenticated
 * @param {ReactNode} children - Components to render if user has permission
 * @param {string} redirectTo - Path to redirect if unauthorized (default: shows Unauthorized component)
 * 
 * @example
 * // Single permission
 * <ProtectedRoute permission="user_management.view">
 *   <UserManagement />
 * </ProtectedRoute>
 * 
 * @example
 * // Multiple permissions (ANY)
 * <ProtectedRoute permission={["users.view", "users.edit"]}>
 *   <UserManagement />
 * </ProtectedRoute>
 * 
 * @example
 * // Multiple permissions (ALL)
 * <ProtectedRoute permission={["users.edit", "users.delete"]} requireAll={true}>
 *   <AdminPanel />
 * </ProtectedRoute>
 * 
 * @example
 * // Just require authentication
 * <ProtectedRoute requireAuth={true}>
 *   <Dashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ 
    permission, 
    requireAll = false, 
    requireAuth = true,
    children,
    redirectTo = null,
    unauthorizedMessage = null
}) => {
    const { auth } = useAuth();
    const userRoleCode = auth?.roles?.[0];

    // Check if user is authenticated
    if (requireAuth && !auth?.adminID) {
        return <Navigate to="/login" replace />;
    }

    // If no permission specified, just check auth
    if (!permission) {
        return children;
    }

    // Check permissions
    let hasAccess = false;

    if (Array.isArray(permission)) {
        if (requireAll) {
            hasAccess = hasAllPermissions(userRoleCode, permission);
        } else {
            hasAccess = hasAnyPermission(userRoleCode, permission);
        }
    } else {
        hasAccess = hasPermission(userRoleCode, permission);
    }

    // If user doesn't have access
    if (!hasAccess) {
        // Redirect to specific path if provided
        if (redirectTo) {
            return <Navigate to={redirectTo} replace />;
        }
        
        // Otherwise show Unauthorized component
        return (
            <Unauthorized 
                title="Access Denied"
                message={unauthorizedMessage || "You do not have permission to access this page."}
                showReturnButton={true}
            />
        );
    }

    // User has access, render children
    return children;
};

export default ProtectedRoute;
