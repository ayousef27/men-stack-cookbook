const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const session = require('express-session')
const passUserToView = require('./middleware/pass-user-to-view')
const isSignedIn = require('./middleware/is-signed-in')
const app = express()

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
app.set('view engine', 'ejs')
const PORT = process.env.PORT ? process.env.PORT : '3000'

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB Database: ${mongoose.connection.name}`)
})

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)
app.use(passUserToView)
//Require Controllers
const authCtrl = require('./controllers/auth')
const recipeController = require('./controllers/recipes')
const ingredientController = require('./controllers/ingredients')


// Use Controller
app.use('/auth', authCtrl)
app.use('/recipes', recipeController)
app.use('/ingredients', ingredientController)
// Root route
app.get('/', async (req, res) => {
  res.render('index.ejs')
})
// Route for testing
//VIP-lounge
app.get("/vip-lounge", isSignedIn, (req, res) => {
  res.send(`Welcome to the party ${req.session.user.username}`)
})

app.listen(PORT, () => {
  console.log(`Cookbook App is listening for request ${PORT}`)
})
