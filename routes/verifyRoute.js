const express = require('express')
const router = express.Router()

// Appointment model
const Appointment = require('../models/appointmentModel')

// Updating Handle
router.get("/:uid", (req, res, next) => {    
    Appointment.find({ uid: req.params.uid }, (err, result) => {
        if (result.length) {
            return res.render('pdf/verify', { layout: false, result: result})
            //return res.send(`Details Found. The report status of ${result[0].full_name} is ${result[0].status_text} on ${result[0].date}`)
        }
        else {
            return res.send('Not Found. Looks like the report doesn\'t exists.')
        }    
    })
})


module.exports = router