'use strict';

let handleGET = (() => {
	var _ref2 = _asyncToGenerator(function* (req, res) {
		try {
			let id;
			let result;

			if (req.path) id = req.path.split('/')[1];

			if (id) result = yield Data.findById(id);else result = yield Data.find(req.query);

			return res.status(200).json(result);
		} catch (err) {
			console.error('get', err);
			yield mongoose.disconnect();
			return res.status(500).json(err);
		}
	});

	return function handleGET(_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
})();

let handlePOST = (() => {
	var _ref3 = _asyncToGenerator(function* (req, res) {
		try {
			let item = yield new Data(req.body).save();
			return res.status(200).json(item);
		} catch (err) {
			console.error('post', err);
			yield mongoose.disconnect();
			return res.status(500).json(err);
		}
	});

	return function handlePOST(_x5, _x6) {
		return _ref3.apply(this, arguments);
	};
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

require('./Data');
const Data = require('mongoose').model('Data');

process.on('unhandledRejection', (reason, promise) => {
	console.error(reason, promise);
});

/**
 * Cloud Function.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
exports.data = (() => {
	var _ref = _asyncToGenerator(function* (req, res) {
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-Methods', '*');
		try {
			yield mongoose.connect(process.env.MONGO_URL, { useMongoClient: true });

			switch (req.method) {
				case 'GET':
					handleGET(req, res);
					break;
				case 'POST':
					handlePOST(req, res);
					break;
				default:
					res.status(409).end();
					break;
			}
		} catch (err) {
			console.error('data', err);
			yield mongoose.disconnect();
			return res.status(500).json(err);
		}
	});

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
})();