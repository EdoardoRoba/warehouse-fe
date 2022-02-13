const mongoose = require('mongoose')
const Schema = mongoose.Schema // defines the schema of the data

// schema
const emailTemplateSchema = new Schema({
    template: {
        type: String,
        required: true
    }
}, { timestamps: true });

// model. The string defines the model name (very important)
const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema)
module.exports = EmailTemplate