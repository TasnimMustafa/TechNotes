const NoteModel = require('../models/Note');
const UserModel = require('../models/User')
const  {logger} = require('../middleware/logger')
const errorHandler = require('../middleware/errorHandler')

const createNote = async (req, res) =>{
    try {
        
        if(!req.body.title , !req.body.noteBody , !req.body.owner){
            return res.status(400).send("All fields required")
        }
        
        const duplicatedNote = (await NoteModel.find({title:req.body.title})).filter((note)=>{
            return note.title
        })
        if(duplicatedNote.length !== 0){
            return res.status(400).json({
                   message: "Duplicated Note",
            });
        }
        const user = (await UserModel.find({_id:req.body.owner})).filter((user)=>{
            return user._id
       })
       if(user.length == 0){
        return res.status(404).json({
               message: "user not found",
        });
       }
        const note = new NoteModel(req.body);
        await note.save();
        res.status(201).json({
            status: 201,
            message: "Note Created",
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}


const showNotes = async (req,res)=>{
    try
    {
        const Notes = await NoteModel.find({}).populate('owner','username -_id');

        if(Notes.length == 0){
            return res.status(404).send("There aren't Notes")
        }
        res.status(200).json({
            status : 200,
            data: Notes,
        });
    }
    catch(error)
    {
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
    
}

const showNote = async (req,res)=>{
    try
    {
        const _id = req.params.id
        const Note = await NoteModel.findById({_id}).populate('owner','username -_id');
        if(!Note){
            return res.status(404).json({message:`can not find any note with ID : ${_id}`})
        }
        res.status(200).json({
            status : 200,
            data: Note,
        });
    }
    catch(error)
    {
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
    
}


const updateNote = async (req,res)=>{
    try
    {
        const duplicatedNote = (await NoteModel.find({title:req.body.title})).filter((note)=>{
            return note.title
        })
        if(duplicatedNote.length > 1){
            return res.status(400).json({
                   message: "Duplicated Note",
            });
        }
        const user = (await UserModel.find({_id:req.body.owner})).filter((user)=>{
            return user._id
       })
       if(user.length == 0){
        return res.status(404).json({
               message: "user not found",
        });
       }
       
        const _id = req.params.id
        const Note = await NoteModel.findByIdAndUpdate({_id},req.body,{
            new:true,
            runValidators:true
        });

        if(!Note){
            return res.status(404).json({message:`can not find any note with ID : ${_id}`})
        }
        res.status(200).json({
            status : 200,
            data: Note,
        });
    }
    catch(error)
    {
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
    
}

const deleteNote = async (req,res)=>{
    try
    {
        const _id = req.params.id
        
        const Note = await NoteModel.findByIdAndDelete({_id});
        if(!Note){
            return res.status(404).json({message:`can not find any Note with ID : ${_id}`})
        }              
        res.status(200).json({
            status : 200,
            data: Note,
        });
    }
    catch(error)
    {
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
    
}

module.exports ={createNote,showNotes,showNote,updateNote,deleteNote}




      
        
