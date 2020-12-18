const mongoose = require("mongoose");

const PracticeSchema = new mongoose.Schema({
    level1: Array,
    level2: Array,
    level3: Array,
    level4: Array,
    level5: Array,
    date:{
        type: Date,
        default: Date.now,
    },
});

mongoose.model("iigp_practices", PracticeSchema);
