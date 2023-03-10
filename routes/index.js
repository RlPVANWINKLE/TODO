const express = require('express')
const router = express.Router()
const account = require('../models/Accounts')

router.get('/', async (req, res) => {
  let query = account.find()
  const accounts = await query.exec()
  res.render('Accounts/index', {
    accounts:accounts
  });
})

module.exports = router