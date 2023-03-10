const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const AccountRouter = require('./routes/Accounts')
const ApplicationRouter = require('./routes/Applications')
const TaskRouter = require('./routes/Tasks')
const UserRouter = require('./routes/Users')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://RIPVANWINKLE:plop@cluster0.rvosq.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true})



app.use('/', indexRouter)
app.use('/account', AccountRouter)
app.use('/application', ApplicationRouter)
app.use('/task', TaskRouter)
app.use('/users', UserRouter)

app.listen(process.env.PORT || 3000)