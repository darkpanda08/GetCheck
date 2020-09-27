const express = require('express')
const router = express.Router()

const { ensureAuthenticated } = require('../config/auth')

// Welcome Page
router.get('/', (req, res) => res.render('home', {layout : false, user: req.user}))


router.get("/status", (req, res) => {    
    res.render('dashboard/covid_status', { layout: false, username: req.user.name })
})

router.get("/incentives", (req, res) => {    
    res.render('dashboard/incentives', { layout: false, username: req.user.name })
})

router.get("/calender-chart", (req, res) => {    
    res.render('dashboard/calender_chart', { layout: false, username: req.user.name })
})


module.exports = router