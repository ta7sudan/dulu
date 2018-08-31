'use strict';
const figlet = require('figlet');
const {name} = require('../../../package');

function getFiglet() {
	return new Promise((rs, rj) => {
		figlet(
			name,
			{
				horizontalLayout: 'fitted'
			},
			(err, data) => {
				if (err) {
					rj(err);
				} else {
					rs(data);
				}
			}
		);
	});
}

module.exports = getFiglet;
