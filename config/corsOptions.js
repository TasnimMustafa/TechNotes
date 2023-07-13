const allowedOrigins = require('./allowedOrigins')


var corsOptions = {
  origin: (origin, callback) =>{
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by Cors'))
    }
  },
  Credential: true
}

module.exports = {corsOptions}