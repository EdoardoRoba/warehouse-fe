const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const structureSchema = new Schema({
    columns: {
        type: Number,
        required: true
    },
    rows: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Structure = mongoose.model('Structure', structureSchema)
module.exports = Structure