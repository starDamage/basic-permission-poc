function checkPermission(resource, operation) {
    return (req, res, next) => {
        const userPermissions = req.user.permissions; // Assume permissions are attached to `req.user`
        
        if (!userPermissions || !userPermissions[resource]) {
            return res.status(403).json({ message: 'Access denied: No permissions for this resource.' });
        }

        const hasPermission = 
            userPermissions[resource].all ||  // Full access override
            userPermissions[resource][operation]; // Specific operation access

        if (!hasPermission) {
            return res.status(403).json({ message: `Access denied: No permission to ${operation} on ${resource}.` });
        }

        next(); // User has permission, proceed to the route handler
    };
}

module.exports = { checkPermission };
