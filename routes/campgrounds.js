const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const campgrounds = require('../controllers/campgrounds')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const Campground = require('../models/campground')  // Campground schema

// all campgrounds
router.get('/', catchAsync(campgrounds.index))
// insert new campground form
router.get('/new', isLoggedIn, campgrounds.newForm)
// post request to insert new campground
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`campgrounds/${campground._id}`)
}))
// show individual campground
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!campground) {
        req.flash('error', 'Cannot find the campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))
// edit campground form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params 
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find the campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))
// edit campground submit
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', "Successfully updated campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}))
// delete campground and the associated reviews
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}))

module.exports = router