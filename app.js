const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");
const bodyParser = require("body-parser");
const path = require("path");

require("./models/User");
require("./models/School");
require("./models/Class");
require("./models/DistrictOfficer");
require("./models/SchoolAdmin");
require("./models/Principal");
require("./models/Teacher");
require("./models/Student");
require("./models/Parent");
require("./models/Practice");
require("./models/PracticeResult");
require("./models/ExamResult");
require("./models/Exam");
require("./models/QuestionBank");
require("./models/Homework");
require("./models/Assignment");
require("./models/LabWork");
require("./models/Lesson");
require("./models/Poll");
require("./models/Announcement");
require("./services/passport");
require("./models/Calendar");
require("./models/Discussion");
require("./models/Resource");

mongoose.connect(keys.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.json());

app.use(
	cookieSession({
		maxAge: 1 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey],
	})
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/filesRoutes")(app);
require("./routes/SuperAdminRoutes")(app);
require("./routes/districtOfficerRoutes")(app);
require("./routes/schoolAdminRoutes")(app);
require("./routes/controllerRoutes")(app);
require("./routes/studentRoutes")(app);
require("./routes/teacherRoutes")(app);
require("./routes/parentRoutes")(app);

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

module.exports = app;
