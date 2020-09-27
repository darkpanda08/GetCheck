const express = require('express')
const {v4 : uuidv4} = require('uuid')
const router = express.Router()

const { ensureAuthenticated } = require('../config/auth')

// Appointment model
const Appointment = require('../models/appointmentModel')

router.get('/', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'customer') {
        res.render('dashboard/book_form', {layout: false, username: req.user.name})
    } else {
        res.redirect('/appointments')
    }
})

router.post('/', (req, res) => {
    const { full_name, age, email, address, phone, state, date, gender, testing_center } = req.body;
    const status = 1;
    const score = '00';
    const status_text = 'Pending';
    status_code = `${state}${status}${gender}${score}`
    
    const appointment = new Appointment({
        uid: uuidv4(),
        full_name,
        email,
        age,
        gender,
        address,
        phone,
        state,
        status,
        status_text,
        date,
        score,
        status_code,
        testing_center,
        booking_user: req.user._id
    })

    appointment.save().then((appointment) => {
        req.flash('success_msg', 'Booking Successful.')
        return res.redirect('/book')
    }).catch(err => {
        req.flash('error', 'Something went wrong')
        return res.redirect('/book')
    })
})



module.exports = router