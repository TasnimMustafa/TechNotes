const {format} = require("date-fns")
const {v4:uuid} = require("uuid")
const fs = require("fs")
const fsPromises = require("fs").promises
const path = require("path")

// helper Function 
const logEvents = async(message,logFileName)=>{
    const dateTime = format(new Date(),`yyyyMMdd\tHH:mm:ss`)
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        if (!fs.existsSync(path.join(__dirname,"..","logs"))) {
            await fsPromises.mkdir(__dirname,"..","logs")
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',logFileName),logItem)
    } catch (error) {
        console.log(error)        
    }

}


const logger = async (req,res,next)=>{
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method}\t${req.path}`)
    next()
}

module.exports = {logEvents,logger}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const winston = require("winston");

// var Id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
// const custonFormat = winston.format.combine(winston.format.timestamp({
//     format: 'YYYY-MM-DD  HH:mm:ss'
// }),winston.format.printf((info)=>{
//     return `${info.timestamp} ${Id} ${info.message}` 
// }))


// const  logEvents = winston.createLogger({
//     level:'error',
//     format: custonFormat,
//     transports : [
//         new winston.transports.File(
//             {
//                 filename: './logs/error.log',
//                  level: 'error',
//             }
//             ),
//         new winston.transports.File(
//             {
//                 filename: './logs/info.log',
//                 level: 'info',
//             }
//             )        


//     ]
// })

// module.exports = logEvents