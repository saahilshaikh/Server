module.exports = (req, res, next) => {
    if (req.user.role === "DistrictOfficer") {
        next();
    }
    else {
        return res.status(401).send({ error: "You must be a District Director" });
    }
};