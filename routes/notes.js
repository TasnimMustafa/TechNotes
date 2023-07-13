const express = require("express");
const router = express.Router();
const {createNote,showNotes,showNote,updateNote,deleteNote} = require('../controller/NotesController')
const auth = require("../middleware/auth-Middleware");
const isAdmin = require("../middleware/isAdmin-Middleware");

// notes routes
router.post('/create',auth,createNote);
router.get('/',auth,isAdmin,showNotes);
router.get('/:id',auth,showNote);
router.put('/:id',auth,updateNote);
router.delete('/:id',auth,isAdmin,deleteNote);



module.exports = router



/*
Notes are assigned to specific employees 
 Notes can only be deleted by Managers or Admins
  Anyone can create a note 
  Employees can only view and edit their assigned notes 
  Managers and Admins can view, edit, and delete all notes
*/ 