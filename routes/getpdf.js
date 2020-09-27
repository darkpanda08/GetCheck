const express = require('express')
const qr = require('qrcode')
const router = express.Router()

const { ensureAuthenticated } = require('../config/auth')

// Appointment model
const Appointment = require('../models/appointmentModel')

router.get("/:uid", ensureAuthenticated, (req, res, next) => {    
    Appointment.find({ uid: req.params.uid }, (err, result) => {
        if (result) {
            const url = `https://getcheck.tech/verify/${result[0].uid}`;
            qr.toDataURL(url, (err, src) => {
                if(err) {
                    return res.redirect('/appointments')
                } 
                res.render('pdf/reportpdf', {layout: false, results: result, src: src})
            })
        }
        else {
            return res.redirect('/appointments')
        }    
    })
})

module.exports = router