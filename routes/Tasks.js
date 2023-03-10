const express = require('express')
const router = express.Router()
const account = require('../models/Accounts')
const applications = require('../models/Applications')
const task = require('../models/Tasks')

// router.put('/:id/tasks/new', async (req, res) => {
//     const Task = new task({
//       Title: req.body.title,
//       Description: req.body.desc
//     });




module.exports = router