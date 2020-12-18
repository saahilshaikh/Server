const mongoose = require("mongoose");

const PrincipalSchema = new mongoose.Schema({
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
    qualification: {
        type: String
    },
    experience: {
        type: String
    },
    schoolID: {
        type: String,
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

mongoose.model("principal", PrincipalSchema);
