const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // SUPPORT BOTH TOKEN SHAPES
        req.user = {
            id: decoded.id || decoded.user?.id
        };

        next();
    } catch {
        res.status(400).json({ error: "Invalid token" });
    }
};
