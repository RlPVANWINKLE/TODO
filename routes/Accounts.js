const express = require('express')
const router = express.Router()
const account = require('../models/Accounts')
const applications = require('../models/Applications')
const task = require('../models/Tasks')

// All Accounts Route
router.get('/', async (req, res) => {
  let query = await account.find().sort({ActiveTasks: -1, DSN: 1}); 
  let accounts = query
  let count = 0
  for(let i = 0; i<accounts.length; i++){
    for(let j =0; j<accounts[i].Tasks.length; j++){
      let taskID = accounts[i].Tasks[j]._id;
      let taskOBJ = await task.findById(taskID)
      if(taskOBJ.Status == 'Active'){
        count=count+1;
      }
    }
    let ID = accounts[i]._id
    let Account = await account.findById(ID)
    Account.ActiveTasks=`${count}`
    await Account.save();
    count=0;
  }
  query = await account.find().sort({ActiveTasks: -1, DSN: 1})
  accounts = query;
  res.render('Accounts/index', {
    accounts:accounts,
  });
})

// New Account Route
router.get('/new', async (req, res) => {
  let ER = ''
  const Apps = await applications.find()
  res.render('Accounts/new',{
    Apps:Apps,
    ER:ER,
  });
})
router.get('/cal', async (req, res) => {
  res.render('Accounts/cal');
})
router.put('/:id/details/edit', async (req, res) => {
  let Account = await account.findById(req.params.id);
  Account.DSN = req.body.DSN;
  Account.TimeZone = req.body.timezone;
  Account.Contact1name = req.body.Contact1name;
  Account.Contact1email = req.body.Contact1email;
  Account.Contact2name = req.body.Contact2name;
  Account.Contact2email = req.body.Contact2email;
  Account.Contact3name = req.body.Contact3name;
  Account.Contact3email = req.body.Contact3email;
  await Account.save();
  res.redirect(`/account/${Account.id}/details`)
})

// Create Account Route
router.post('/', async (req, res) => {
  try {
    const Account = new account({
      DSN: req.body.DSN,
      TimeZone: req.body.timezone,
      Contact1name: req.body.Contact1name,
      Contact1email: req.body.Contact1email,
      Contact2name: req.body.Contact2name,
      Contact2email: req.body.Contact2email,
      Contact2name: req.body.Contact2name,
      Contact2email: req.body.Contact2email,
    })
    const KOCTask = new task({
      Title: 'Kick off Call'
    })
    const PTask = new task({
      Title: 'Account Manager',
      Description: 'Add permit to account manager'
    })
    const appTask = new task({
      Title: 'Add apps to account'
    })
    await KOCTask.save();
    await PTask.save();
    await appTask.save();
    Account.Tasks.push(KOCTask.id,PTask.id,appTask.id);
    await Account.save();
    let ER = 'Success'
    res.render('Accounts/new',{
      ER:ER
    }) 
  } catch (error) {
    let ER = error.name
    if(error.name = 'ValidationError'){
      ER = 'DSN is required'
    }    
    res.render('Accounts/new',{
      ER:ER
    })
    //res.send(error.name+": "+error.message);
  }
  
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
router.get('/:id/delete', async (req, res) => {
  let accountID = req.params.id
  const deleted = await account.findByIdAndDelete(accountID)
  res.redirect('/account')  
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
    res.redirect(`/account/${ID}/details/addApps`);
})
router.get('/:id/:task', async (req, res) => {
let taskId = req.params.task
let ID = req.params.id
const taskComplete = await task.findById(taskId)
taskComplete.Status = 'Complete'
await taskComplete.save()
res.redirect(`/account/${ID}/details`)
})
router.get('/:id/:task/active', async (req, res) => {
  let taskId = req.params.task
  let ID = req.params.id
  const taskComplete = await task.findById(taskId)
  taskComplete.Status = 'Active'
  await taskComplete.save()
  res.redirect(`/account/${ID}/details`)
  })
router.get('/:id/:task/delete', async (req, res) => {
  let taskId = req.params.task
  let ID = req.params.id
  const Account = await account.findById(ID)
  const ttbd = Account.Tasks.indexOf(taskId);
  Account.Tasks.splice(ttbd,1);
  await task.findByIdAndDelete(taskId);
  await Account.save();
  res.redirect(`/account/${ID}/details`)
  })

  router.get('/newWeek', async (req, res) => {
    const Accounts = await account.find()
    for(let i = 0; i < Accounts.length; i++){
      const SumEmail = new task({
        Title: 'Summary Email'
      })
      await SumEmail.save();
      Accounts[i].Tasks.unshift(SumEmail.id);
      await Accounts[i].save()
      
    }
    res.redirect('/account/')
  })

module.exports = router