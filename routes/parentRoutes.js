const requireLogin = require("../middlewares/requireLogin");
const requireStudent = require("../middlewares/requireStudent");
const requireParent = require("../middlewares/requireParent");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { response } = require("express");

const Student = mongoose.model("students");
const Parent = mongoose.model("parents");
const Class = mongoose.model("iigp_classes");
const Practice = mongoose.model("iigp_practices");
const Users = mongoose.model("users");
const PracticeResult = mongoose.model('practice_results');
const Teacher = mongoose.model("teachers");
const Announcements = mongoose.model("announcements");
const Calendar = mongoose.model("calendar");
const Discussion = mongoose.model("discussions");
const School = mongoose.model("schools");
const Assignments = mongoose.model("assignments");
const Labs = mongoose.model("labworks");
const Exams = mongoose.model("exams");
const ExamResult = mongoose.model("exam_results");

module.exports = (app) => {

    app.post("/api/parent/profile", requireLogin, requireParent, async (req, res) => {
        const { parentId } = req.body;
        Parent.findOne({ _id: parentId })
            .then(async (parent) => {
                if (parent) {
                    console.log("FOUND PARENT ", parent);
                    var pData = {
                        _id: parent._id,
                        name: parent.name,
                        email: parent.email,
                        children: parent.children,
                        school_id: parent.school_id,
                        status: parent.status
                    };
                    res.send(pData);
                }
                else {
                    res.send({ error: "No student Found", type: "error" })
                }
            })
    })

    // GET IIGP ANALYTICAL REPORTS

    app.post("/api/parent/analytics/getLastTen", requireLogin, requireParent, async (req, res) => {
        const { studentId } = req.body;
        PracticeResult.find({ studentId: studentId }).sort({ date: 'desc' }).limit(10)
            .then((result) => {
                if (result) {
                    res.send(result);
                }
            })
    })

    app.post("/api/parent/analytics/subject", requireLogin, requireParent, async (req, res) => {
        const { studentId, subject } = req.body;
        console.log("63", req.body);
        PracticeResult.find({ studentId: studentId, subject: new RegExp(subject, 'i') }).sort({ date: -1 })
            .then((result) => {
                console.log("65", result);
                if (result.length > 0) {
                    res.send({ data: result, type: "success" });
                }
                else {
                    res.send({ error: "Not Found", type: "error" });
                }
            })
    })

    // GET EXAM ANALYTICAL REPORT
    app.post("/api/parent/examAnalytics/getLastTen", requireLogin, requireParent, async (req, res) => {
        const { studentId } = req.body;
        ExamResult.find({ studentId: studentId })
            .sort({ date: "desc" })
            .limit(10)
            .then((result) => {
                if (result) {
                    res.send(result);
                }
            });
    });

    app.post("/api/parent/examAnalytics/subject", requireLogin, requireParent, async (req, res) => {
        const { studentId, subject } = req.body;
        ExamResult.find({ studentId: studentId, subject: new RegExp(subject, "i") }).then((result) => {
            if (result.length > 0) {
                res.send({ data: result.reverse(), type: "success" });
            } else {
                res.send({ error: "Not Found", type: "error" });
            }
        });
    });

    // STUDENT PROFILE

    app.post("/api/parent/getStudentProfile", requireLogin, requireParent, async (req, res) => {
        const { studentId } = req.body;
        Student.findOne({ _id: studentId })
            .then(async (student) => {
                if (student) {
                    var classInfo = await Class.findOne({ className: student.class }).exec();
                    var exams = await Exams.find({ schoolId: student.school_id, className: student.class, sectionName: student.section }).exec();
                    var labs = await Labs.find({ schoolId: student.school_id }).exec();
                    var calendarEvents = await Calendar.find({ grade: student.class, schoolId: student.school_id, audience: "students" }).exec();
                    var announcements = await Announcements.find({ grade: student.class }).exec();
                    var assignments = await Assignments.find({ schoolId: student.school_id, className: student.class, sectionName: student.section }).exec();
                    var stud = {
                        _id: student._id,
                        photo: student.photo,
                        name: student.name,
                        email: student.email,
                        pname: student.pnmae,
                        pcontact: student.pcontact,
                        pemail: student.pemail,
                        address: student.address,
                        contact: student.contact,
                        dob: student.dob,
                        class: student.class,
                        section: student.section,
                        city: student.city,
                        state: student.state,
                        zip: student.zip,
                        blood: student.blood,
                        school_id: student.school_id,
                        doa: student.doa,
                        practices: student.practices,
                        classInfo: classInfo,
                        participation: student.participation,
                        behaviour: student.behaviour,
                        assignments: student.assignments,
                        attendance: student.attendance,
                        creativity: student.creativity,
                        entrepreneurship: student.entrepreneurship,
                        problemSolving: student.problemSolving,
                        negativePoints: student.negativePoints,
                        positivePoints: student.positivePoints,
                        announcements: announcements,
                        calendarEvents: calendarEvents,
                        assignments: assignments,
                        labs: labs,
                        exams: exams
                    };
                    res.send(stud);
                }
                else {
                    res.send({ error: "No student Found", type: "error" })
                }
            })
    })

}