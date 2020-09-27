const express = require('express')
const router = express.Router()

const { ensureAuthenticated } = require('../config/auth')

// Appointment model
const Appointment = require('../models/appointmentModel')

// Send Mail Function
function updateMail(toEmail) {
    const output = `<html>
        <h3>Hello</h3>
        <p>Your COVID-19 Test Report status has been updated.</p>
        <p>Please login to check or follow the below link where uid is your UID.</p>
        <p>https://getcheck.com/verify/uid</p>
        <p><br></p>
        <p>Regards</p>
        <p>GetCheck</p>
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
        from: '"GetCheck" <status@getcheck.tech>', // sender address
        to: toEmail, // list of receivers
        subject: 'COVID Test Report Status Updated', // Subject line
        text: `Your Test Report Status has been updated`,
        html: output // html body
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error)
        }
    })
}

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
                updateMail(email);
                res.redirect('/appointments')
            }    
        })
    } else {
        res.redirect('/book')
    }
})


module.exports = router
