const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Event name cannot be blank']
    },
    description: {
        type: String,
        required: [true, 'Description cannot be blank']
    },
    url: {
        type: String,
        required: [true, 'Event Url cannot be blank']
    },
    eventdate: {
        type: String,
        required: [true, 'Event Date cannot be blank']
    },
    starttime: {
        type: String,
        required: [true, 'Start Time cannot be blank']
    },
    endtime: {
        type: String,
        required: [true, 'End Time cannot be blank']
    }
})

module.exports = mongoose.model('Event', eventSchema);