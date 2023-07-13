require("dotenv").config();
const express = require("express");
const app = express();
const  {logger} = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const connDB= require('./config/dbconn')
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')
const cors = require("cors");
const { corsOptions } = require('./config/corsOptions');
const path = require("path");
const port = process.env.PORT || 5000;

const router = require("./routes/root")
const notesRoutes = require("./routes/notes")
const usersRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")

connDB()
app.use(logger)
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())

app.use('/',router)
app.use("/note",notesRoutes)
app.use("/user",usersRoutes)
app.use("/auth",authRoutes)

app.all('*',(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,"views","404.html"))
    }
    else if(req.accepts('json')) {
        res.send({message: "404 page not found"})
    }
    else {
        res.type('text').send("404 page not found")
    }
})

app.use(errorHandler)
mongoose.connection.once('open',()=>{
    console.log("connected DB")
    app.listen(port,()=>{console.log(`Server Works!!! ${port}`)})
})
