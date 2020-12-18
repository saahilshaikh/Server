module.exports = (req, res, next) => {
  console.log("2", req.user.role);
  if (req.user.role === "SuperAdmin") {
    next();
  }
  else {
    return res.status(401).send({ error: "You must be a Super Admin" });
  }
};