const express = require('express')
// const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express();

// Connect to server
const dbUri = 'mongodb+srv://admin:bYn3epDI1YwiENB6@cluster0.61jsm.mongodb.net/warehouse?retryWrites=true&w=majority'
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected")
    app.listen(3000)
}).catch((error) => { console.log(error) })

console.log("Hello World!")