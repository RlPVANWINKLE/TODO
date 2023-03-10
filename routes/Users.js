const express = require('express')
const router = express.Router()
const Users = require('../models/Users')

// All Users Route
router.get('/', async (req, res) => {
    let query = Users.find()
    const users = await query.exec()
    res.render('Users/index', {
      users:users
    });
  })
  
  // New Users Route
  router.get('/new', async (req, res) => {
    res.render('Users/new');
  })
  
  // Create Account Route
  router.post('/', async (req, res) => {
    const user = new Users({
      Name: req.body.name,
      Username: req.body.username,
      Password: req.body.password
    })
    await user.save();
      res.redirect('users');
  
  })
  

module.exports = router