const express = require('express')
const router = express.Router()

const { ensureAuthenticated } = require('../config/auth')

// Appointment model
const Appointment = require('../models/appointmentModel')

// Updating Handle
router.get("/:uid", ensureAuthenticated, (req, res, next) => {    
    if(req.user.role == 'testing') {
        Appointment.find({ uid: req.params.uid, testing_center: req.user.testing_center }, (err, result) => {
            if (result.length) {
                res.render('dashboard/update_report', {layout: false, results: result, username: req.user.name})
            }
            else {
                return res.redirect('/appointments')
            }    
        })
    } else {
        res.redirect('/book')
    }
})

router.post('/:uid', ensureAuthenticated, (req, res) => {
    const uid = req.params.uid;
    const { full_name, email, phone, status, score, state, gender, specimen } = req.body;
    var status_text = '';
    var status_code = `${state}${status}${gender}${score}`;

    if(req.user.role == 'testing') {
        if(status == '1') {
            status_text = 'Pending'
        } else if(status == '0') {
            status_text = 'Safe'
        } else {
            status_text = 'Positive'
        }
        Appointment.findOneAndUpdate({ uid: uid, testing_center: req.user.testing_center }, { "$set": { full_name: full_name, email: email, phone: phone, status: status, status_text: status_text, score:score, status_code:status_code, specimen:specimen }}, (err, result) => {
            if (err) {
                req.flash('error_msg', 'Something went wrong.')
                console.log(err)
                return res.redirect('/appointments')
            }
            else {
                req.flash('success_msg', 'Update Successful.')
                res.redirect('/appointments')
            }    
        })
    } else {
        res.redirect('/book')
    }
})


module.exports = router