const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const campgrounds = require('../controllers/campgrounds')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const Campground = require('../models/campground')  // Campground schema

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

// insert new campground form
router.get('/new', isLoggedIn, campgrounds.newForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.submitEdit))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))



// edit campground form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm))

module.exports = router