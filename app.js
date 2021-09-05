const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const path = require('path')
const Campground = require('./models/campground')  // Campground schema

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


// CRUD in RESTful routing
app.get('/', (req, res) => {
    res.render('home')
})
// all campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})
// insert new campground form
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})
// post request to insert new campground
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`campgrounds/${campground._id}`)
})
// show individual campground
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground })
})
// edit campground form
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
})
// edit campground submit
app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})
// delete campground
app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})
