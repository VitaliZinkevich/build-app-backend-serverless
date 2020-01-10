const mongoose = require('mongoose');
// const validator = require('validator');

const model = mongoose.model('Orderbuild', {
name: {
    type: String,
},
phone: {
    type: String,
},
workType: {
    type: [String],
}
},'orderbuild');

module.exports = model;