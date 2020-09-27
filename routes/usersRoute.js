const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const nodemailer = require("nodemailer")

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


// OTP Send Mail Function
function otpMail(toEmail, otp) {
    const output = `<html>
        <h3>Verification Email</h3>
        <p>Thanks for signing up on TestApp</p>
        <p>Your OTP to verify email is: ${otp}</p>
        <p>Please login and enter the above OTP to start using the services.</p>
        <p>Regards</p>
        <p>Vineet Ranjan<p>
        <p>TestApp Team</p>
    </html>`

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.SES_User,
            pass: process.env.SES_Pass
        },
        tls:{
        rejectUnauthorized:false
        }
    })

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"TestApp Account" <verify@darkpanda08.me>', // sender address
        to: toEmail, // list of receivers
        subject: 'Verify your Account', // Subject line
        text: `Your OTP to verify email is: ${otp}`,
        html: output // html body
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error)
        }
    })
    console.log("Mail Sent")
}

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