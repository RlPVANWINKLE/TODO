const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },

})


module.exports = mongoose.model('Applications', applicationSchema)
