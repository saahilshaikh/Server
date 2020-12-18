const requireLogin = require("../middlewares/requireLogin");
const requireStudent = require("../middlewares/requireStudent");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { response } = require("express");

const Student = mongoose.model("students");
const Class = mongoose.model("iigp_classes");
const Practice = mongoose.model("iigp_practices");
const Users = mongoose.model("users");
const PracticeResult = mongoose.model('practice_results');
const Polls = mongoose.model('polls');
const Teacher = mongoose.model('teachers');
const Announcements = mongoose.model('announcements');
const Calendar = mongoose.model('calendar');

module.exports = (app) => {

    app.post("/api/student/profile", requireLogin, requireStudent, async (req, res) => {
        const { studentId } = req.body;
        Student.findOne({ _id: studentId })
            .then(async (student) => {
                if (student) {
                    // var practices = [];
                    var classInfo = await Class.findOne({ className: student.class }).exec();
                    // student.practices.map(async(item) => {
                    //     var practiceInfo = await PracticeResult.findOne({_id:item}).exec();
                    //     practices.push(practiceInfo)
                    // })
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
                        behaviour: student.behaviour,
                        assignments: student.assignments,
                        attendance: student.attendance,
                        creativity: student.creativity,
                        entrepreneurship: student.entrepreneurship,
                        problemSolving: student.problemSolving,
                        negativePoints: student.negativePoints,
                        positivePoints: student.positivePoints
                    };
                    res.send(stud);
                }
                else {
                    res.send({ error: "No student Found", type: "error" })
                }
            })
    })

    app.post("/api/iigp/getChapter", async (req, res) => {
        const { grade } = req.body;
        Class.findOne({ className: grade })
            .then((response) => {
                if (response) {
                    res.send(response);
                    console.log(response);
                }
                else {
                    res.send({ error: "No class found", type: "error" })
                }
            })
    })

    app.post("/api/iigp/getPractice", async (req, res) => {
        const { practiceId } = req.body;
        Practice.findOne({ _id: practiceId })
            .then((response) => {
                if (response) {
                    res.send(response);
                }
                else {
                    console.log("Error");
                }
            })
    })


    app.post("/api/practice/saveresult", async (req, res) => {
        const { practiceId, topic, chapter, subject, studentId, duration, score, correct, wrong, level1, level2, level3, level4, level5 } = req.body;

        new PracticeResult({
            practiceId: practiceId,
            topic: topic,
            chapter: chapter,
            subject: subject,
            studentId: studentId,
            duration: duration,
            score: score,
            correct: correct,
            wrong: wrong,
            level1: level1,
            level2: level2,
            level3: level3,
            level4: level4,
            level5: level5
        })
            .save()
            .then((r) => {
                if (r) {
                    Student.findOne({ _id: studentId })
                        .then((student) => {
                            if (student) {
                                var practices = student.practices;
                                practices.push(r._id);
                                student.practices = practices;
                                student.save()
                                    .then(re => {
                                        if (re) {
                                            res.send({ success: "Result saved", type: "success" })
                                        }
                                        else {
                                            res.send({ error: "Error in saving result to student", type: "error" })
                                        }
                                    })
                                    .catch(() => {
                                        res.send({ error: "Error in saving result", type: "error" })
                                    })
                                return null;
                            }
                            else {
                                res.send({ error: "Error student not found", type: "error" })
                            }
                        })
                        .catch(() => {
                            res.send({ error: "Student not saving error", type: "error" })
                        })
                    return null;
                }
                else {
                    res.send({ error: "Error in saving result", type: "error" })
                }
            })
    })

    // GET ANALYTICAL REPORTS

    app.post("/api/analytics/getLastTen", requireLogin, requireStudent, async (req, res) => {
        const { studentId } = req.body;
        PracticeResult.find({ studentId: studentId }).sort({ date: 'desc' }).limit(10)
            .then((result) => {
                if (result) {
                    res.send(result);
                }
            })
    })

    app.post("/api/analytics/subject", requireLogin, requireStudent, async (req, res) => {
        const { studentId, subject } = req.body;
        PracticeResult.find({ studentId: studentId, subject: new RegExp(subject, 'i') })
            .then((result) => {
                if (result.length > 0) {
                    res.send({ data: result.reverse(), type: "success" });
                }
                else {
                    res.send({ error: "Not Found", type: "error" });
                }
            })
    })

    // STUDENT SCHOOL API

    app.post("/api/myschool/getTeacher", requireLogin, requireStudent, async (req, res) => {
        const { teacherId } = req.body;
        Teacher.findOne({ _id: teacherId })
            .then((result) => {
                res.send({ result });
            })
    })

    // Polls

    app.post("/api/myschool/getPolls", requireLogin, requireStudent, async (req, res) => {
        const { grade } = req.body;
        Polls.find({ grade: grade })
            .then((result) => {
                res.send(result);
            })
    })

    app.post("/api/myschool/submitPoll", requireLogin, requireStudent, async (req, res) => {
        const { pollId, questions } = req.body;
        Polls.findOne({ _id: pollId })
            .then((poll) => {
                poll.questions = questions;
                poll.save()
                    .then((r) => {
                        res.send({ type: "success" });
                    })
            })
    })

    // Announcements

    app.post("/api/myschool/getAnnouncements", requireLogin, requireStudent, async (req, res) => {
        const { grade } = req.body;
        Announcements.find({ grade: grade })
            .then((result) => {
                res.send(result);
            })
    })

    // Calendar
    app.post("/api/myschool/calendarEvents", requireLogin, requireStudent, async (req, res) => {
        const { grade, schoolId } = req.body;
        Calendar.find({ grade: grade, schoolId: schoolId, audience: 'students' })
            .then((result) => {
                res.send(result);
            })
    })

}