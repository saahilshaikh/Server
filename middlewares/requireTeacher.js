module.exports = (req, res, next) => {
    if (req.user.role === "Teacher") {
        next();
    }
    else {
        return res.status(401).send({ error: "You must be a Teacher" });
    }
};