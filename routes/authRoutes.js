const passport = require("passport");

module.exports = (app) => {
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
      if (info) {
        return res.send({ error: info.message, type: "error" });
      }
      req.logIn(user, function (err) {
        if (err) {
          return res.send({ error: err, type: "error" });
        }
        return res.send({ user: user, type: "result" });
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });

  app.get("/api/server", (req, res) => {
    res.send("hi! from server");
  });
};
