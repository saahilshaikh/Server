const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const requireLogin = require("../middlewares/requireLogin");

const SchoolAdmin = mongoose.model("schoolAdmins");
const Users = mongoose.model("users");
const School = mongoose.model("schools");
const Teacher = mongoose.model("teachers");
const Student = mongoose.model('students');
const Parent = mongoose.model('parents');
const Class = mongoose.model("iigp_classes");

module.exports = (app) => {

    //PROFILE

    app.post("/api/schoolAdmin/info", requireLogin, async (req, res) => {
        const { id } = req.body;
        SchoolAdmin.findOne({ _id: id })
            .then(schoolAdmin => {
                if (schoolAdmin) {
                    res.send(schoolAdmin);
                }
                else {
                    res.send([])
                }
            })
    });

    app.post("/api/schoolAdmin/editProfile", requireLogin, async (req, res) => {
        const { id, name, photo, address, dob, contact, qualification, experience, city, state, zip } = req.body;
        SchoolAdmin.findOne({ _id: id })
            .then(schoolAdmin => {
                if (schoolAdmin) {
                    schoolAdmin.photo = photo;
                    schoolAdmin.name = name;
                    schoolAdmin.address = address;
                    schoolAdmin.contact = contact;
                    schoolAdmin.dob = dob;
                    schoolAdmin.qualification = qualification;
                    schoolAdmin.experience = experience;
                    schoolAdmin.city = city;
                    schoolAdmin.state = state;
                    schoolAdmin.zip = zip;
                    schoolAdmin.save()
                        .then(response => {
                            if (response) {
                                res.send({ success: "School Administrator Info Updated", type: "success" })
                            }
                        })
                }
                else {
                    res.send({ error: "Error Updating School Administrator Info!", type: "error" })
                }
            })
    });

    app.post("/api/schoolAdmin/editPassword", requireLogin, async (req, res) => {
        const { email, password } = req.body;
        console.log(email);
        const newpassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
        Users.findOne({ email: email })
            .then(user => {
                if (user) {
                    user.password = newpassword;
                    user.save()
                        .then(resp => {
                            res.send({ success: "Password Updated", type: "success" })
                        })
                }
                else {
                    res.send({ error: "Error Changing Password!", type: "error" })
                }
            })
    });

    //SCHOOL

    app.post("/api/schoolAdmin/schoolInfo", requireLogin, async (req, res) => {
        const { schoolId } = req.body;
        console.log(schoolId);
        var resp = await School.findOne({ _id: schoolId }).exec();
        var schoolInfo = resp;
        var teachers = [];
        if (resp && resp.teachers.length > 0) {
            for (var i = 0; i < schoolInfo.teachers.length; i++) {
                var teacher = await Teacher.findOne({ _id: schoolInfo.teachers[i].id }).exec();
                teachers.push(teacher);
            }
        }
        if (teachers.length > 0) {
            schoolInfo.teachers = teachers;
        }
        var students = [];
        if (resp && resp.students.length > 0) {
            for (var i = 0; i < schoolInfo.students.length; i++) {
                var student = await Student.findOne({ _id: schoolInfo.students[i].id }).exec();
                students.push(student);
            }
        }
        if (students.length > 0) {
            schoolInfo.students = students;
        }
        res.send(schoolInfo);
    });

    app.get("/api/schoolAdmin/iigpClasses", requireLogin, async (req, res) => {
        Class.find().then(classes => {
            res.send(classes);
        })
    });

    app.post("/api/schoolAdmin/editSchool", requireLogin, async (req, res) => {
        const { name, branch, address, email, contact, logo, fax, website, schoolId } = req.body;
        School.findOne({ _id: schoolId })
            .then(school => {
                if (school) {
                    school.logo = logo;
                    school.name = name;
                    school.branch = branch;
                    school.address = address;
                    school.email = email;
                    school.contact = contact;
                    school.fax = fax;
                    school.website = website;
                    school.save()
                        .then(response => {
                            if (response) {
                                res.send({ success: "School Info Updated", type: "success" })
                            }
                        })

                }
                else {
                    res.send({ error: "School Ref Not Found", type: "error" })
                }
            })
    });


    //TEACHER

    app.post("/api/schoolAdmin/addTeacher", requireLogin, async (req, res) => {
        const { name, email, address, contact, photo, zip, city, state, dob, qualification, experience, schoolId } = req.body; //request data coming from react front end
        const password = await bcrypt.hashSync(email, bcrypt.genSaltSync(8), null)

        Users.findOne({ email: email })
            .then(user => {
                if (user) {
                    res.send({ error: "User exists with same email id", type: "error" })
                }
                else {
                    new Teacher({
                        photo: photo,
                        name: name,
                        email: email,
                        address: address,
                        contact: contact,
                        dob: dob,
                        qualification: qualification,
                        experience: experience,
                        city: city,
                        state: state,
                        zip: zip,
                        school_id: schoolId
                    })
                        .save()
                        .then((r) => {
                            new Users({
                                email: email,
                                name: name,
                                role: "Teacher",
                                password: password,
                                ref_id: r._id
                            }).save()
                                .then((response) => {
                                    School.findOne({ _id: schoolId })
                                        .then(school => {
                                            if (school) {
                                                var teachers = school.teachers;
                                                var data = {
                                                    name: name,
                                                    id: r._id.toString(),
                                                    email: email
                                                };
                                                teachers.push(data);
                                                school.teachers = teachers;
                                                school.save()
                                                    .then(re => {
                                                        if (re) {
                                                            res.send({ success: "School Teacher Added", type: "success" })
                                                        }
                                                    })
                                            }
                                        })
                                })

                        })
                }
            })
    });

    app.post("/api/schoolAdmin/teacherInfo", requireLogin, async (req, res) => {
        const { id } = req.body;
        Teacher.findOne({ _id: id })
            .then(teacher => {
                if (teacher) {
                    res.send(teacher);
                }
                else {
                    res.send([])
                }
            })
    });

    app.post("/api/schoolAdmin/editTeacher", requireLogin, async (req, res) => {
        const { id, name, photo, address, dob, contact, qualification, experience, city, state, zip } = req.body;
        Teacher.findOne({ _id: id })
            .then(teacher => {
                if (teacher) {
                    teacher.photo = photo;
                    teacher.name = name;
                    teacher.address = address;
                    teacher.contact = contact;
                    teacher.dob = dob;
                    teacher.qualification = qualification;
                    teacher.experience = experience;
                    teacher.city = city;
                    teacher.state = state;
                    teacher.zip = zip;
                    teacher.save()
                        .then(response => {
                            if (response) {
                                res.send({ success: "School Teacher Info Updated", type: "success" })
                            }
                        })
                }
                else {
                    res.send({ error: "Error Updating School Teacher Info!", type: "error" })
                }
            })
    });

    app.post("/api/schoolAdmin/assignTeacher", requireLogin, async (req, res) => {
        const { id, className, subjectName, sectionName, lab } = req.body;
        Teacher.findOne({ _id: id })
            .then(teacher => {
                if (teacher) {
                    console.log("T FOUND");
                    var subject = {
                        class: className,
                        section: sectionName,
                        subject: subjectName,
                        lab: lab
                    }
                    teacher.subjects.push(subject);
                    console.log(teacher.subjects);
                    teacher.save()
                        .then(resp => {
                            res.send({ success: "Assigned", type: "success" })
                        })
                }
                else {
                    res.send({ error: "Error Assigning Subject!", type: "error" })
                }
            })
    });


    app.post("/api/schoolAdmin/reassignTeacher", requireLogin, async (req, res) => {
        const { id, className, subjectName, sectionName } = req.body;
        Teacher.findOne({ _id: id })
            .then(teacher => {
                if (teacher) {
                    var newsubjects = [];
                    teacher.subjects.map(sub => {
                        if (sub.class === className && sub.section === sectionName && sub.subject === subjectName) { }
                        else {
                            newsubjects.push(sub);
                        }
                    })
                    teacher.subjects = newsubjects;
                    teacher.save()
                        .then(resp => {
                            res.send({ success: "Reassigned", type: "success" })
                        })
                }
                else {
                    res.send({ error: "Error removing!", type: "error" })
                }
            })
    });

    app.post("/api/schoolAdmin/removeTeacher", requireLogin, async (req, res) => {
        const { id, schoolId } = req.body;
        School.findOne({ _id: schoolId })
            .then(school => {
                if (school) {
                    var teachers = school.teachers;
                    var newTeachers = [];
                    teachers.map(teacher => {
                        if (teacher.id !== id) {
                            newTeachers.push(teacher)
                        }
                    })
                    console.log("43", newTeachers);
                    school.teachers = newTeachers;
                    school.save()
                        .then(r => {
                            console.log("SR 151", r);
                            Teacher.findOne({ _id: id })
                                .then(teacher => {
                                    if (teacher) {
                                        var email = teacher.email;
                                        Users.findOneAndDelete({ email: email })
                                            .then(re => {
                                                console.log("SR 159", re);
                                                Teacher.findOneAndDelete({ _id: id })
                                                    .then(resp => {
                                                        console.log("SR 162", resp);
                                                        res.send({ success: "Successfully Removed School Teacher", type: "success" })
                                                    })
                                            })
                                    }
                                })
                        })
                }
            })
    });


    //STUDENT

    app.post("/api/schoolAdmin/addStudent", requireLogin, async (req, res) => {
        const { pcontact, pname, blood, name, email, address, pemail, contact, photo, zip, city, state, dob, className, sectionName, schoolId } = req.body; //request data coming from react front end
        const password = await bcrypt.hashSync(email, bcrypt.genSaltSync(8), null);
        const password2 = await bcrypt.hashSync(pemail, bcrypt.genSaltSync(8), null);
        Users.findOne({ email: email })
            .then(user => {
                if (user) {
                    res.send({ error: "User exists with same email id", type: "error" })
                }
                else {
                    new Student({
                        photo: photo,
                        name: name,
                        email: email,
                        pname: pname,
                        pcontact: pcontact,
                        pemail: pemail,
                        address: address,
                        contact: contact,
                        dob: dob,
                        class: className,
                        section: sectionName,
                        city: city,
                        state: state,
                        zip: zip,
                        blood: blood,
                        school_id: schoolId
                    })
                        .save()
                        .then((r) => {
                            new Users({
                                email: email,
                                name: name,
                                role: "Student",
                                password: password,
                                ref_id: r._id
                            }).save()
                                .then((response) => {
                                    School.findOne({ _id: schoolId })
                                        .then(school => {
                                            if (school) {
                                                var students = school.students;
                                                var data = {
                                                    name: name,
                                                    id: r._id.toString(),
                                                    email: email
                                                };
                                                students.push(data);
                                                school.students = students;
                                                school.save()
                                                    .then(re => {
                                                        if (re) {
                                                            Users.findOne({ email: pemail })
                                                                .then(user => {
                                                                    if (user) {
                                                                        Parent.findOne({ _id: user.ref_id })
                                                                            .then(parent => {
                                                                                if (parent) {
                                                                                    var children = parent.children;
                                                                                    var child = {
                                                                                        id: r._id.toString()
                                                                                    }
                                                                                    children.push(child);
                                                                                    parent.children = children;
                                                                                    console.log(parent.children);
                                                                                    parent.save()
                                                                                        .then(p => {
                                                                                            res.send({ success: "Student Added", type: "success" })
                                                                                        })
                                                                                }
                                                                            })
                                                                    }
                                                                    else {
                                                                        var children = [];
                                                                        var child = {
                                                                            id: r._id.toString()
                                                                        }
                                                                        children.push(child);
                                                                        new Parent({
                                                                            children: children,
                                                                            email: pemail,
                                                                            school_id: schoolId
                                                                        })
                                                                            .save()
                                                                            .then(p => {
                                                                                new Users({
                                                                                    email: pemail,
                                                                                    role: "Parent",
                                                                                    password: password2,
                                                                                    ref_id: p._id
                                                                                }).save()
                                                                                    .then(u => {
                                                                                        res.send({ success: "Student Added", type: "success" });
                                                                                    })
                                                                            })
                                                                    }
                                                                })

                                                        }
                                                    })
                                            }
                                        })
                                })

                        })
                }
            })
    });

    app.post("/api/schoolAdmin/editStudent", requireLogin, async (req, res) => {
        const { id, name, photo, address, dob, contact, qualification, experience, city, state, zip, className, sectionName, blood, pcontact, pname } = req.body;
        Student.findOne({ _id: id })
            .then(student => {
                if (student) {
                    student.photo = photo;
                    student.pname = pname;
                    student.pcontact = pcontact;
                    student.name = name;
                    student.address = address;
                    student.contact = contact;
                    student.dob = dob;
                    student.class = className;
                    student.section = sectionName;
                    student.city = city;
                    student.state = state;
                    student.zip = zip;
                    student.blood = blood;
                    student.save()
                        .then(response => {
                            if (response) {
                                res.send({ success: "Info Updated", type: "success" })
                            }
                        })
                }
                else {
                    res.send({ error: "Error Updating Info!", type: "error" })
                }
            })
    });



    app.post("/api/schoolAdmin/removeStudent", requireLogin, async (req, res) => {
        const { id, schoolId } = req.body;
        School.findOne({ _id: schoolId })
            .then(school => {
                if (school) {
                    var students = school.students;
                    var newStudents = [];
                    students.map(student => {
                        if (student.id !== id) {
                            newStudents.push(student)
                        }
                    })
                    school.students = newStudents;
                    school.save()
                        .then(r => {
                            Student.findOne({ _id: id })
                                .then(student => {
                                    if (student) {
                                        var email = student.email;
                                        Users.findOneAndDelete({ email: email })
                                            .then(re => {
                                                Student.findOneAndDelete({ _id: id })
                                                    .then(resp => {
                                                        Parent.findOne({ email: student.pemail })
                                                            .then(parent => {
                                                                if (parent) {
                                                                    console.log("462", parent);
                                                                    var children = parent.children;
                                                                    var newChildren = [];
                                                                    children.map(child => {
                                                                        if (child.id !== id) {
                                                                            newChildren.push(child);
                                                                        }
                                                                    })
                                                                    if (newChildren.length > 0) {
                                                                        console.log('RAN CASE 1');
                                                                        parent.children = newChildren;
                                                                        parent.save()
                                                                            .then(p => {
                                                                                console.log('RAN CASE 1 SUCC');
                                                                                res.send({ success: "Successfully Removed Student", type: "success" });
                                                                            })
                                                                    }
                                                                    else {
                                                                        console.log('RAN CASE 2');
                                                                        Parent.findOneAndDelete({ _id: parent._id })
                                                                            .then(p => {
                                                                                Users.findOneAndDelete({ email: parent.email })
                                                                                    .then(s => {
                                                                                        console.log('RAN CASE 2 SUCC');
                                                                                        res.send({ success: "Successfully Removed Student", type: "success" });
                                                                                    })
                                                                            })
                                                                    }
                                                                }
                                                            })
                                                    })
                                            })
                                    }
                                })
                        })
                }
            })
    });

    //CLASS

    app.post("/api/schoolAdmin/addClass", requireLogin, async (req, res) => {
        const { schoolId, className, sections, cycle } = req.body;
        console.log(req.body);
        School.findOne({ _id: schoolId })
            .then(school => {
                if (school) {
                    var classList = school.classes;
                    var found = false
                    classList.map(classDetails => {
                        if (classDetails.name === className) {
                            found = true;
                        }
                    })
                    if (found) {
                        classList.map(classDetails => {
                            if (classDetails.name === className) {
                                classDetails.sections = sections;
                                classDetails.doa = Date.now();
                                classDetails.cycle = cycle;
                            }
                        })
                    }
                    else {
                        var classInfo = {
                            name: className,
                            sections: sections,
                            doa: Date.now(),
                            cycle: cycle
                        };
                        classList.push(classInfo);
                    }
                    school.classes = classList;
                    school.save()
                        .then(resp => {
                            res.send({ success: "Classs Added", type: "success" })
                        })
                }
                else {
                    res.send({ error: "Could not add class", type: "error" })
                }
            })
    });



}