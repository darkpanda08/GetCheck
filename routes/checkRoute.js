const express = require('express')
const router = express.Router()

const { ensureAuthenticated } = require('../config/auth')

// Appointment model
const Appointment = require('../models/appointmentModel')

router.get('/',ensureAuthenticated, (req, res, next) => {
    Appointment.find({booking_user: req.user._id}, (err, result) => {    
        res.render('dashboard/check_report', {
            layout: false,
            results: result,
            username: req.user.name
        })
    })
})

module.exports = router