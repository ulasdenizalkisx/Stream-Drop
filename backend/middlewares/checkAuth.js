function isAuthenticated(req, res, next) {
    if (!req.session.access_token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    next();
}