const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema({
  DSN: {
    type: String,
    required: true
  },
  TimeZone:{
    type: String
  },
  Contact1name:{
    type: String,
    default:'NA'
  },
  Contact1email:{
    type: String,
    default:'NA'
  },
  Contact2name:{
    type: String,
    default:'NA'
  },
  Contact2email:{
    type: String,
    default:'NA'
  },
  Contact3name:{
    type: String,
    default:'NA'
  },
  Contact3email:{
    type: String,
    default:'NA'
  },
  Application1: [{type:String, ref: 'Applications', default:''}],

  Tasks:[{type:mongoose.Schema.Types.ObjectId, ref:'Tasks'}],

  ActiveTasks: {
    type: String,
    default: 'Hello World'
  }
  // Tasks:[{type:String, ref:'Tasks', default:''}]
})


module.exports = mongoose.model('Accounts', AccountSchema)
