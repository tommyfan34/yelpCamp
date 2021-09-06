const User = require('../models/user')

module.exports.renderUserRegister = (req, res) => {
    res.render('users/register')
}

module.exports.userRegister = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)   // automatically register the user to mongodb
        // automatically login in the user after registeration
        req.login(registeredUser, err => {
            if (err) return next(err)
            else {
                req.flash('success', 'Welcom to YelpCamp!')
                res.redirect('/campgrounds')
            }
        })
        req.flash('success', "Welcome to Yelpcamp!")
        res.redirect('/campgrounds')
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back! ')
    // go to the url the user orginally wants to go or go back to /campgrounds
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout()  // passport logout
    req.flash('success', 'Goodbye!')
    res.redirect('/campgrounds')
}