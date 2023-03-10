const express = require('express')
const router = express.Router()
const application = require('../models/Applications')

// Applications Route
router.get('/', async (req, res) => {
    const applications = await application.find();
    res.render('Applications/index', {
      applications:applications
    });
})

// New Application Route
router.get('/new', (req, res) => {
  res.render('Applications/new', {
    application: new application()
  })
})

// Create Application Route
router.post('/', async (req, res) => {
  const Application = new application({
    Name: req.body.name
  })
    const newApplication = await Application.save()
    res.redirect(`application/new`)
})

router.get('/:id/edit', async (req, res) => {
  try {
    const app = await application.findById(req.params.id)
    res.render('Applications/edit', {
      app:app,
    })
  } catch {
    res.redirect('/')
  }
})

router.put('/:id', async (req, res) => {
  let Application
  Application = await application.findById(req.params.id)
  Application.Name = req.body.name
  await Application.save()
  res.redirect(`/application/`)
})


module.exports = router