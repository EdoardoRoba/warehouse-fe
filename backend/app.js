const express = require('express')
const mongoose = require('mongoose')
const Structure = require('./models/structure')
const Tool = require('./models/tool')
const EmailTemplate = require('./models/emailTemplate')
const History = require('./models/History')
const Employee = require('./models/Employee')
const bodyParser = require('body-parser')
var nodemailer = require('nodemailer');
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

//EMAIL
app.post('/sendEmail', (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'idroaltech.bot@gmail.com',
            pass: 'uhgsasuiilzrncwb'
        }
    });

    var mailOptions = {
        from: 'idroaltech.bot@gmail.com',
        to: 'roba.edoardo@gmail.com',
        subject: 'NOTIFICA',
        text: 'Prova'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            res.send('Email sent: ' + info.response)
        }
    });
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
// POST
app.post('/tool', (req, res) => {
    const tool = new Tool({
        label: req.body.label,
        quantity: req.body.quantity,
        lowerBound: req.body.lowerBound,
        row: req.body.row,
        column: req.body.column,
        price: req.body.price,
        lastUser: req.body.lastUser
    })
    // console.log("tool: ", tool)
    tool.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error:", error)
        res.status(400).send(new Error('description'));
    })
})

// GET
app.get('/tool', (req, res) => {
    // it gets all the element in that document
    Tool.find().then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})
//GET SINGLE
app.get('/tool/:id', (req, res) => {
    // it gets all the element in that document
    Tool.findById(req.params.id).then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})

// PUT
app.put('/tool/:id', (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    const quantity = req.body.quantity
    const label = req.body.label
    Tool.findById(id).then((result) => {
        if (parseInt(quantity) < result.lowerBound) {
            EmailTemplate.find().then((resultEmail) => {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'idroaltech.bot@gmail.com',
                        pass: 'uhgsasuiilzrncwb'
                    }
                });

                var mailOptions = {
                    from: 'idroaltech.bot@gmail.com',
                    to: 'roba.edoardo@gmail.com', // info@idroaltech.it',
                    subject: 'NOTIFICA QUANTITA\' LIMITE - ' + label.toUpperCase(),
                    html: resultEmail[0].template.replace("{label}", result.label).replace("{label}", result.label).replace("{quantity}", quantity).replace("{lowerBound}", result.lowerBound).replace("{price}", result.price).replace("{column}", result.column).replace("{row}", result.row)
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.send('Email sent: ' + info.response)
                    }
                });
            }).catch((error) => { console.log("error: ", error) })
        }
        Tool.findByIdAndUpdate(
            { _id: id },
            body
        ).then((resultTool) => {
            res.send(resultTool)
        }).catch((error) => {
            console.log("error: ", error)
        })
    }).catch((error) => { console.log("error: ", error) })

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


// HISTORY
// POST
app.post('/history/:tool', (req, res) => {
    const history = new History({
        user: req.body.user,
        tool: req.params.tool,
        quantity: req.body.quantity
    })
    // console.log("history: ", history)
    history.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error:", error)
    })
})



// EMPLOYEE
// POST
app.post('/employee', (req, res) => {
    const employee = new Employee({
        name: req.body.name,
        lastName: req.body.lastName,
        birth: req.body.birth,
        fiscalCode: req.body.fiscalCode
    })
    // console.log("employee: ", employee)
    employee.save().then((result) => {
        res.send(result)
    }).catch((error) => {
        console.log("error:", error)
    })
})

// GET
app.get('/employee', (req, res) => {
    // it gets all the element in that document
    Employee.find().then((result) => {
        res.send(result);
    }).catch((error) => { console.log("error: ", error) })
})