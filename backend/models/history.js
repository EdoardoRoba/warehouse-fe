const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const historySchema = new Schema({
    user: {
        type: String,
        required: true
    },
    tool: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const History = mongoose.model('History', historySchema)
module.exports = History