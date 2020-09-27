const express = require('express')
const qr = require('qrcode')
const {v4 : uuidv4} = require('uuid')
const router = express.Router()

// Appointment model
const Appointment = require('../models/appointmentModel')

router.get('/getpdf/:uid', (req, res) => {
    Appointment.find({ uid: req.params.uid }, (err, result) => {
        if (result.length) {
            const url = `https://getcheck.tech/verify/${result[0].uid}`;
            qr.toDataURL(url, (err, src) => {
                if(err) {
                    res.json({ "status": "error", "error": err})
                } 
                res.render('pdf/reportpdf', {layout: false, results: result, src: src})
            })
        }
        else {
            res.json({ "status": "error", "error": err})
        }    
    })
})

router.get("/verify/:uid", (req, res) => {    
    Appointment.find({ uid: req.params.uid }, (err, result) => {
        if (result.length) {
            return res.send(`The report status of Patient Name: ${result[0].full_name} is ${result[0].status_text} on ${result[0].date}`)
        }
        else {
            return res.send('Not Found. Looks like the report doesn\'t exists.')
        }    
    })
})

router.post("/add/appointments", (req, res) => {  
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
        testing_center
    })

    appointment.save().then((appointment) => {
        return res.json(appointment)
    }).catch(err => {
        return res.json({ "status": "error", "error": err})
    })
})

router.post("/update/:uid", (req, res) => {    
    const uid = req.params.uid;
    const { email, status, score, specimen } = req.body;
    var status_text = '';
    var status_code = `${state}${status}${gender}${score}`;

    if(status == '1') {
        status_text = 'Pending'
    } else if(status == '0') {
        status_text = 'Safe'
    } else {
        status_text = 'Positive'
    }
    Appointment.findOneAndUpdate({ uid: uid }, { "$set": { email: email, status: status, status_text: status_text, score:score, status_code:status_code, specimen:specimen }}, (err, result) => {
        if (result.length) {
            return res.json(result)
        }
        else {
            return res.json({ "status": "error", "error": err})
        }    
    })
})

module.exports = router