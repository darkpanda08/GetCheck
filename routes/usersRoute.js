const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

// User model
const User = require('../models/userModel')

// Login Page
router.get('/login', (req, res) => {
    // If not logged in open welcome page
    if (!req.user) {
        res.render('dashboard/login', {layout: false})
    } else {
        req.flash('error_msg_logged', 'You are already logged in')
        return res.redirect('/book')
    }
})

// Register Page
router.get('/register', (req, res) => {
    // If not logged in open welcome page
    if (!req.user) {
        res.render('dashboard/register', {layout: false})
    } else {
        req.flash('error_msg_logged', 'Log out to proceed with Registration')
        return res.redirect('/book')
    }
}) 

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []

    // Check required fields
    if(!name || !email || !password ) {
        errors.push({ msg: 'Please fill in all fields' })
    }
    
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
            phone,
            title: "Register - TestApp"
        })
    } else {
        // Validation Pass
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({ msg: 'Email is already registered.'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err                              
                            // Set password to hashed
                            newUser.password = hash
                            // Save User
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Registration Successful.')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                    }))
                }
            })
    }

})

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/book',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are successfully logged out')
    res.redirect('/')
})

module.exports = router
