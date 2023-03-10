const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  Title: {
    type: String,
    require: true
  },
  Description: {
    type: String,
    require: true
  },
  Status:{
    type: String,
    default: 'Active'
  }
})


module.exports = mongoose.model('Tasks', taskSchema)