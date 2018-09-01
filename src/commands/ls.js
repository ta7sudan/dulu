'use strict';

const {name: cmdName} = require('../../package');
const handler = require('../handlers/ls');

const ls = {
	command: 'ls [template]',
	desc: 'list available pre-define template',
	builder(yargs) {
		return yargs.example(`${cmdName} ls`, 'show all pre-define template');
	},
	handler
};

module.exports = ls;
