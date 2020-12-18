const mongoose = require("mongoose");

const SchoolAdminSchema = new mongoose.Schema({
    photo: {
        type: Object,
        default: {}
    },
    name: {
        type: String,
    },
    contact: {
        type: String,
    },
    address: {
        type: String,
    },
    email: {
        type: String
    },
    dob: {
        type: String
    },
    qualification: {
        type: String
    },
    experience: {
        type: Number,
        default: 0
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zip: {
        type: String
    },
    school_id: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    doa: {
        type: Date,
        default: Date.now,
    },
});

mongoose.model("schoolAdmins", SchoolAdminSchema);
