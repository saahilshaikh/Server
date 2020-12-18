const mongoose = require("mongoose");

const CalendarSchema = new mongoose.Schema({
    userId: String,
    schoolId: String,
    title: String,
    audience: String,
    grade: String,
    start: String,
    end: String,
    allDay: Boolean,
    doa: {
        type: Date,
        default: Date.now,
    },
});

mongoose.model("calendar", CalendarSchema);