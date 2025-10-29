import useAuth from '../hooks/useAuth';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/rolePermissions';

/**
 * PermissionGate Component
 * 
 * Conditionally renders children based on user permissions.
 * 
 * @param {string|string[]} permission - Single permission or array of permissions to check
 * @param {boolean} requireAll - If true and permission is an array, user must have ALL permissions
 * @param {ReactNode} children - Content to render if user has permission
 * @param {ReactNode} fallback - Optional content to render if user lacks permission
 * 
 * @example
 * // Single permission
 * <PermissionGate permission="USERS_ADD">
 *   <button>Create User</button>
 * </PermissionGate>
 * 
 * @example
 * // Multiple permissions (any)
 * <PermissionGate permission={["USERS_VIEW", "USERS_EDIT"]}>
 *   <button>Manage Users</button>
 * </PermissionGate>
 * 
 * @example
 * // Multiple permissions (all required)
 * <PermissionGate permission={["USERS_EDIT", "USERS_DELETE"]} requireAll={true}>
 *   <button>Full Admin Access</button>
 * </PermissionGate>
 */
const PermissionGate = ({ permission, requireAll = false, children, fallback = null }) => {
    const { auth } = useAuth();
    // Get role code from auth.roles array (e.g., 5150 for Admin)
    const userRoleCode = auth?.roles?.[0];

    if (!userRoleCode) {
        return fallback;
    }

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

    return hasAccess ? children : fallback;
};

export default PermissionGate;
