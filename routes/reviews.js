const express = require('express')
const router = express.Router({mergeParams: true})
const Review = require('../models/review')
const Campground = require('../models/campground')  // Campground schema
const catchAsync = require('../utils/catchAsync')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')

// add a review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.addReview))

// delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router