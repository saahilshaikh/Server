const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const requireLogin = require("../middlewares/requireLogin");
const requireDistrictOfficer = require("../middlewares/requireDistrictDirector");
const { response } = require("express");

const DistrictOfficers = mongoose.model("districtOfficers"); //Schema to fetch all the docs from collection districtOfficers from mongo
const Users = mongoose.model("users");
const School = mongoose.model("schools");
const Principal = mongoose.model("principal");

module.exports = (app) => {

    //Get all schools
    // app.post("/api/districtOfficer/getAllSchools", requireLogin, requireDistrictOfficer, async (req, res) => {
    //     const { officerID } = req.body;
    //     var sList = [];
    //     DistrictOfficers.findOne({ _id: officerID })
    //         .then((officer) => {
    //             if (officer.schoolList.length > 0) {
    //                 officer.schoolList.map((school) => {
    //                     School.findOne({ _id: school.id })
    //                         .then((schoolItem) => {
    //                             sList.push(schoolItem);
    //                         })
    //                 })
    //                 // res.send(sList);
    //                 console.log(sList);
    //             }
    //             else {
    //                 // res.send({ error: "No Schools found", type: "error" });
    //                 console.log("error");
    //             }
    //         })
    // })

    //Get district director profile
    app.post("/api/districtOfficer/profile", requireLogin, requireDistrictOfficer, async (req, res) => {
        const { officerID } = req.body;
        DistrictOfficers.findOne({ _id: officerID })
            .then((officer) => {
                if (officer) {
                    res.send(officer);
                }
                else {
                    res.send({ error: "No profile found", type: "error" })
                }
            })
    })

    //Get single school information

    app.post("/api/districtOfficer/getSchoolInfo", requireLogin, requireDistrictOfficer, async (req, res) => {
        const { schoolID } = req.body;
        School.findOne({ _id: schoolID })
        .then((school) => {
            if (school) {
                res.send(school);
            }
            else {
                res.send({ error: "No school found", type: "error" })
            }
        })
    })

    //Create a new principal and assign him to a school
    app.post("/api/districtOfficer/createPrincipal", requireLogin, requireDistrictOfficer, async (req, res) => {
        const { fname, lname, email, contact, address, city, state, zip, qualification, experience, schoolID } = req.body;
        const password = await bcrypt.hashSync(req.body.email, bcrypt.genSaltSync(8), null)

        Principal.findOne({ email: email })
            .then((princi) => {
                if (princi) {
                    res.send({ error: "Principal Already Exists", type: "error" })
                }
                else {
                    new Principal({
                        firstName: fname,
                        lastName: lname,
                        address: address,
                        contact: contact,
                        email: email,
                        city: city,
                        state: state,
                        zip: zip,
                        qualification: qualification,
                        experience: experience,
                        schoolID: schoolID
                    }).save()
                        .then((response) => {
                            new Users({
                                email: email,
                                name: fname + " " + lname,
                                role: "Principal",
                                password: password,
                                ref_id: response._id
                            }).save()
                                .then((resp) => {
                                    School.findOne({ _id: schoolID })
                                        .then(school => {
                                            if (school) {
                                                var principal = school.principal;
                                                var data = {
                                                    name: fname + " " + lname,
                                                    id: response._id.toString()

                                                };
                                                principal.push(data);
                                                school.principal = principal;
                                                school.save()
                                                    .then(re => {
                                                        if (re) {
                                                            res.send({ success: "School Principal Added", type: "success" })
                                                        }
                                                    })
                                            }
                                        })
                                })
                        })
                }
            })
    })

    //Delete principal

    app.post("/api/districtOfficer/deletePrincipal", requireLogin, requireDistrictOfficer, async (req, res) => {
        const { principalId, schoolId } = req.body;

        School.findOne({ _id: schoolId })
            .then((school) => {
                if (school) {
                    var principal = school.principal;
                    var newPrincipal = [];
                    principal.map((item) => {
                        if (item.id !== principalId) {
                            newPrincipal.push(item);
                        }
                    })
                    school.principal = newPrincipal;
                    school.save()
                        .then((response) => {
                            Principal.findOne({ _id: principalId })
                                .then((princi) => {
                                    if (princi) {
                                        Users.findOneAndDelete({ ref_id: principalId })
                                            .then((resp) => {
                                                Principal.findOneAndDelete({ _id: principalId })
                                                    .then((re) => {
                                                        res.send({ success: "Principal successfully deleted", type: "success" });
                                                    })
                                            })
                                    }
                                })
                        })
                }
            })
    })

    //Fetch single principal info

    app.post("/api/districtOfficer/getPrincipalInfo", requireLogin, requireDistrictOfficer, async (req, res) => {
        const { principalId } = req.body;

        Principal.findOne({ _id: principalId })
            .then((principal) => {
                if (principal) {
                    res.send(principal);
                }
                else {
                    res.send({ error: "No principal found", type: "error" });
                }
            })
    })

    //Edit principal information
    app.post("/api/districtOfficer/editPrincipal", requireLogin, requireDistrictOfficer, async (req, res) => {
        const { fname, lname, contact, address, city, state, zip, qualification, experience, schoolId, principalId } = req.body;
        Principal.findOne({ _id: principalId })
            .then((principal) => {
                if (principal) {
                    principal.firstName = fname;
                    principal.lastName = lname;
                    principal.contact = contact;
                    principal.address = address;
                    principal.city = city;
                    principal.state = state;
                    principal.zip = zip;
                    principal.qualification = qualification;
                    principal.experience = experience;
                    principal.save()
                        .then((response) => {
                            if (response) {
                                Users.findOne({ ref_id: principalId })
                                    .then((user) => {
                                        user.name = fname + " " + lname
                                        user.save()
                                            .then((resp) => {
                                                if (resp) {
                                                    res.send({ success: "Principal successfully deleted", type: "success" });
                                                }
                                            })
                                    })
                            }
                        })
                }
            })
    })





}   