const express = require('express')
const mongoose = require('mongoose')
const Structure = require('./models/structure')
const Tool = require('./models/tool')
const bodyParser = require('body-parser')
const app = express();
const feUrl = "http://localhost:3000"
const port = 8050

var cors = require('cors')

app.use(bodyParser.json())
const whitelist = [feUrl]
// enable CORS policy
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}
app.use(cors(corsOptions))

// Connect to server
const dbUri = 'mongodb+srv://admin:bYn3epDI1YwiENB6@cluster0.61jsm.mongodb.net/warehouse?retryWrites=true&w=majority'
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected")
    app.listen(port)
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


// STRUCTURE OF THE WAREHOUSE:
// POST
app.post('/structure', (req, res) => {
    const structure = new Structure({
        columns: req.body.columns,
        rows: req.body.rows
    })
    structure.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error:", error)
    })
})

// GET
app.get('/structure', (req, res) => {
    // it gets all the element in that document
    Structure.find().then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})

//GET SINGLE
// app.get('/getSingleStructure', (req, res) => {
//     // it gets all the element in that document
//     Structure.findById('62040f12443a3b4085cf4a03').then((result) => {
//         res.send(result);
//     }).catch((error) => { console.log("error: ", error) })
// })

// PUT
app.put('/structure/:id', (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    Structure.findByIdAndUpdate(
        { _id: id },
        body
    ).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error: ", error)
    })
})

//DELETE
app.delete('/structure/:id', (req, res) => {
    const id = req.params.id;
    Structure.deleteOne(
        { _id: id }
    ).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error: ", error)
    })
})



// TOOLS
app.post('/tool', (req, res) => {
    const tool = new Tool({
        label: req.body.label,
        quantity: req.body.quantity,
        row: req.body.row,
        column: req.body.column,
        price: req.body.price
    })
    // console.log("tool: ", tool)
    tool.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error:", error)
    })
})

// GET
app.get('/tool', (req, res) => {
    // it gets all the element in that document
    Tool.find().then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})

// PUT
app.put('/tool/:id', (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    Tool.findByIdAndUpdate(
        { _id: id },
        body
    ).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error: ", error)
    })
})

//DELETE
app.delete('/tool/:id', (req, res) => {
    const id = req.params.id;
    Tool.deleteOne(
        { _id: id }
    ).then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error: ", error)
    })
})