function authorize(roles) {
    return (req, res, next) => {
        const userRoles = req.user.roles;
        if (roles.some(role => userRoles.includes(role))) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden' });
        }
    };
}

module.exports = authorize;
