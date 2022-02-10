const express = require('express')
const mongoose = require('mongoose')
const Structure = require('./models/structure')
const bodyParser = require('body-parser')
const app = express();

var cors = require('cors')

app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Connect to server
const dbUri = 'mongodb+srv://admin:bYn3epDI1YwiENB6@cluster0.61jsm.mongodb.net/warehouse?retryWrites=true&w=majority'
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected")
    app.listen(8000)
}).catch((error) => { console.log(error) })

console.log("Hello World!")

app.get('/', (req, res) => {
    res.redirect('/default')
    // res.send("Default API. Nothing is happening.")
})

app.get('/default', (req, res) => {
    Structure.find().then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})

// GET/POST
app.get('/postStructure', (req, res) => {
    const structure = new Structure({
        columns: 4,
        rows: 10
    })
    // this command saves (POST) the object
    structure.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error:", error)
    })
})

// GET
app.get('/getStructure', (req, res) => {
    // it gets all the element in that document
    Structure.find().then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})

//GET SINGLE
app.get('/getSingleStructure', (req, res) => {
    // it gets all the element in that document
    Structure.findById('62040f12443a3b4085cf4a03').then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})

// PUT
app.put('/updateStructure/:id', (req, res, next) => {
    console.log(req.params.id)
    console.log(req.body)
    const id = req.params.id;
    const body = req.body;
    Structure.findByIdAndUpdate(
        { _id: id },
        { $set: { body } }
    ).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error: ", error)
    })
})