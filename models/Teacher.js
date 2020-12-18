const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
    photo: {
        type: Object,
        default: {}
    },
    name: {
        type: String,
    },
    email: {
        type: String
    },
    address: {
        type: String,
    },
    dob: {
        type: String,
    },
    contact: {
        type: String,
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
    subjects: [
        {
            class: String,
            section: String,
            subject: String
        }
    ],
    status: {
        type: Boolean,
        default: true
    },
    todo:{
        type:Array,
        default:[]
    },
    announcement : {
        type:Array,
        default:[]
    },
    poll : {
        type : Array,
        default:[]
    },
    doa: {
        type: Date,
        default: Date.now,
    },
});

mongoose.model("teachers", TeacherSchema);
