const mongoose = require("mongoose");

const DistrictOfficerSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    contact: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    zip: {
        type: String,
    },
    email: {
        type: String
    },
    schoolList: {
        type: Array,
        default: []
    },
    status: {
        type: Boolean,
        default: true
    },
    doa: {
        type: Date,
        default: Date.now,
    },
    experience: {
        type: String
    },
    qualification: {
        type: String
    }
});

mongoose.model("districtOfficers", DistrictOfficerSchema);
