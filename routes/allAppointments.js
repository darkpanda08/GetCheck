const express = require('express')
const router = express.Router()

const { ensureAuthenticated } = require('../config/auth')

// Appointment model
const Appointment = require('../models/appointmentModel')

router.get('/', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'testing') {
        Appointment.find({testing_center: req.user.testing_center}, (err, result) => {
            res.render('dashboard/testing_all_appointments.ejs', {layout: false, results: result, username: req.user.name})
        })
    } else {
        res.redirect('/book')
    }
    
})

module.exports = router