const jwt = require("jsonwebtoken"), adminKey = process.env.ADMIN_JWTKEY,
    key = process.env.JWTKEY, helpers = require("../helpers/api");

const generateToken = (_id, isAdmin = false) => {
    if (isAdmin) {
        return jwt.sign({id: _id}, adminKey, {expiresIn: "1 days"});
    }
    return jwt.sign({id: _id}, key, {expiresIn: "2 days"});
};

const auth = (req, res, next) => {
    const token = req.headers["x-access-token"];
    try {
        const decoded = jwt.verify(token, key) ? jwt.verify(token, key) : jwt.verify(token, adminKey);
        console.log(decoded);
    } catch (err) {
        return helpers.handleError("Invalid token", res);
    }
    return next();
};

const hasAccess = (req, res, next) => {
    const token = req.headers["x-access-token"];
    try {
        const decoded = jwt.verify(token, adminKey);
        return res.status(201).json({
            success: true,
            code: 201,
            isAdmin: true,
        });
    } catch (err) {
        return next();
    }
}

module.exports = {generateToken, auth, hasAccess};
