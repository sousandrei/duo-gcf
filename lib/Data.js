'use strict';

const mongoose = require('mongoose');

let dataSchema = mongoose.Schema({
	amps: Number
});

module.exports = mongoose.model('Data', dataSchema);