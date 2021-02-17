const mongoose = require("mongoose");

const ParentSchema = new mongoose.Schema({
    children: [
        {
            id: String
        }
    ],
    name: {
        type: String,
    },
    email: {
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

mongoose.model("parents", ParentSchema);
