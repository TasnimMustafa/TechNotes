const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = new mongoose.Schema({
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    title:{
        type : String,
        required : true,
        trim : true,
    },
    noteBody:{
        type : String,
        required : true
    },
    completed:{
        type: Boolean,
        default: false
    }
},
{timestamps: true}
);

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq : 500,
})

const NoteModel = mongoose.model('notes',noteSchema);



module.exports = NoteModel




// const counterSchema = new mongoose.Schema({
//     id:{
//         type:String
//     },
//     seq:{
//         type:Number
//     }
// })

// const counterModel = mongoose.model('counters',counterSchema);




