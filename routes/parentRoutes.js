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
const PracticeResult=mongoose.model('practice_results');

module.exports = (app) => { 

    app.post("/api/parent/profile", requireLogin, requireParent, async(req, res) => {
        const { parentId } = req.body;
        Parent.findOne({_id: parentId})
        .then(async(parent) => {
            if (parent) {
                console.log("FOUND PARENT ", parent);
                var pData = {
                    _id : parent._id,
                    email : parent.email,
                    children : parent.children,
                    school_id : parent.school_id,
                    status : parent.status
                };
                res.send(pData);
            }
            else {
                res.send({ error : "No student Found", type : "error"})
            }
        })
    })

    // GET IIGP ANALYTICAL REPORTS

    app.post("/api/parent/analytics/getLastTen", requireLogin, requireParent, async(req, res) => {
        const { studentId } = req.body;
        PracticeResult.find({studentId : studentId}).sort({date: 'desc'}).limit(10)
        .then((result) => {
            if (result) {
                res.send(result);
            }
        })
    })

    app.post("/api/parent/analytics/subject", requireLogin, requireParent, async(req, res) => {
        const { studentId, subject } = req.body;
        PracticeResult.find({studentId : studentId, subject : new RegExp(subject, 'i')})
        .then((result) => {
            if (result.length > 0) {
                res.send({data : result.reverse(), type : "success"});
            }
            else {
                res.send({error : "Not Found", type : "error"});
            }
        })
    })

    app.post("/api/parent/getStudentProfile", requireLogin, requireParent, async(req, res) => {
        const { studentId } = req.body;
        Student.findOne({_id: studentId})
        .then(async(student) => {
            if (student) {
                // var practices = [];
                var classInfo = await Class.findOne({className : student.class}).exec();
                // student.practices.map(async(item) => {
                //     var practiceInfo = await PracticeResult.findOne({_id:item}).exec();
                //     practices.push(practiceInfo)
                // })
                var stud = {
                    _id : student._id,
                    photo : student.photo,
                    name : student.name,
                    email : student.email,
                    pname : student.pnmae,
                    pcontact : student.pcontact,
                    pemail : student.pemail,
                    address : student.address,
                    contact : student.contact,
                    dob : student.dob,
                    class : student.class,
                    section : student.section,
                    city : student.city,
                    state : student.state,
                    zip : student.zip,
                    blood  :student.blood,
                    school_id : student.school_id,
                    doa : student.doa,
                    practices : student.practices,
                    classInfo : classInfo
                };
                res.send(stud);
            }
            else {
                res.send({ error : "No student Found", type : "error"})
            }
        })
    })

}