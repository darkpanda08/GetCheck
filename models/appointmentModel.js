const mongoose = require('mongoose')

const Schema = mongoose.Schema

const appointmentSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    full_name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    status_code: {
        type: String
    },
    status: {
        type: String
    },
    status_text: {
        type: String
    },
    score: {
        type: String
    },
    specimen: {
        type: String
    },
    testing_center: {
        type: String,
        required: true
    },
    booking_user: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Appointment', appointmentSchema)