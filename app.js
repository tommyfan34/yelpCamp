if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()  // STORE THE CLOUDINARY API AND KEY TO .ENV
}
const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require("connect-flash")
const path = require('path')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const MongoDBStore = require("connect-mongo")  // store session info on mongo Atlas instead of memory

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl, {
})
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database connected")
})

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


// middlewares
app.use(express.urlencoded({ extended: true }))  // to parse the submitted form
app.use(methodOverride('_method'))  // fake PATCH / DELETE request
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())  // prevent from mongo injection
app.use(helmet({contentSecurityPolicy: false}))  // html secure middleware


const secret = process.env.SECRET || 'thisisdevelopmentsecret'
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret: secret,
    ttl: 24 * 3600
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store: store,
    name: "notDefault",
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}
app.use(session(sessionConfig))
app.use(flash())  // flash function

// use passport for authentication functionality
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success')   // ???success flash?????????????????????
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})


// campgrpound and review RESTful CURD router
app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


// home router
app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
