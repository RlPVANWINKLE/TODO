const express = require('express')
const router = express.Router()
const account = require('../models/Accounts')
const applications = require('../models/Applications')
const task = require('../models/Tasks')

// All Accounts Route
router.get('/', async (req, res) => {
  let query = account.find()
  const accounts = await query.exec()
  res.render('Accounts/index', {
    accounts:accounts
  });
})

// New Account Route
router.get('/new', async (req, res) => {
  const Apps = await applications.find()
  res.render('Accounts/new',{
    Apps:Apps
  });
})

// Create Account Route
router.post('/', async (req, res) => {
  const Account = new account({
    DSN: req.body.DSN,
    TimeZone: req.body.timezone
  })
  await Account.save();
    res.redirect('account');

})

router.get('/:id/details', async (req, res) => {
  let ID = req.params.id
  let query = account.findById(ID)
  const Account = await query.exec()
  const Apps = Account.Application1 
  const Tasks = Account.Tasks
  const tasks = []
  for(let index = 0; index < Tasks.length; index++){
    let Task = await task.findById(Tasks[index]);
    tasks.push(Task);
  }
  res.render('Accounts/details', {
    Apps:Apps,
    acc:ID,
    tasks:tasks,
    Account:Account
  });
  console.log(tasks)
})
router.get('/:id/details/addApps', async (req, res) => {
  let ID = req.params.id
  const Apps = await applications.find()
  const Account = await account.findById(ID).exec()
  res.render('Accounts/apps',{
    ID:ID,
    Apps:Apps,
    Account:Account

  })
})
router.get('/:id/tasks', async (req, res) => {
  let ID = req.params.id
  const Account = await account.findById(ID)
  const Application = Account.Tasks
  const tasks = []
  for(let index = 0; index < Application.length; index++){
    let Task = await task.findById(Application[index]);
    tasks.unshift(Task);
  }
  res.render('Accounts/tasks', {
    Application:Application,
    ID:ID,
    tasks:tasks
  })
})
router.put('/:id/tasks/new', async (req, res) => {
  const Task = new task({
    Title: req.body.title,
    Description: req.body.desc
  })
  await Task.save();
  let ID = req.params.id
  const Account = await account.findById(ID)
  const Application = Account.Tasks
  Application.unshift(Task);
  await Account.save();
  res.redirect(`/account/${ID}/tasks`)
})
router.put('/:id', async (req, res) => {
  let ID = req.params.id
  const Account = await account.findById(ID)
  Account.Application1.push(req.body.A1)
    const newAccount = await Account.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`/account/${ID}/details/addApps`);
})
router.get('/:id/:task', async (req, res) => {
let taskId = req.params.task
let ID = req.params.id
const taskComplete = await task.findById(taskId)
taskComplete.Status = 'Complete'
taskComplete.save()
res.redirect(`/account/${ID}/details`)
})
router.get('/:id/:task/delete', async (req, res) => {
  let taskId = req.params.task
  let ID = req.params.id
  const Account = await account.findById(ID)
  const ttbd = Account.Tasks.indexOf(taskId);
  Account.Tasks.splice(ttbd,1);
  Account.save();
  res.redirect(`/account/${ID}/details`)
  })

module.exports = router