const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema ({
    alpha_two_code: String,
    web_pages: [],
    name: String,
    country: String,
    domains: [],
    state_province: String
});

const University = mongoose.model('University', universitySchema);

module.exports = University