const express = require('express')
const router = express.Router()

// Appointment model
const Appointment = require('../models/appointmentModel')

router.get('/', (req, res, next) => {
    Appointment.find({},'-full_name -email -address -phone -booking_user -createdAt -updatedAt -_id -__v', (err, result) => {    
        res.json(result)
    })
})

module.exports = router