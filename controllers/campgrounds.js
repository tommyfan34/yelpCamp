const Campground = require('../models/campground')  // Campground schema

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
} 

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
}