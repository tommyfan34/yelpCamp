const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require("connect-flash")

const path = require('path')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews.js')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
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

const sessionConfig = {
    secret: 'thisshoulebeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')   // 将success flash存储为本地变量
    res.locals.error = req.flash('error')
    next()
})


// campgrpound and review RESTful CURD router
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

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


app.listen(3000, () => {
    console.log('Serving on port 3000')
})
