const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const employeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birth: {
        type: String,
        required: true
    },
    fiscalCode: {
        type: String,
        required: true
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const Employee = mongoose.model('Employee', employeeSchema)
module.exports = Employee