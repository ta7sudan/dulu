'use strict';

const handler = require('../handlers/ls');
const {getCmds} = require('../lib/utils');

const ls = {
	command: 'ls [template]',
	desc: 'list available pre-define template or cache',
	builder(yargs) {
		return (
			yargs
				// .conflicts('c', 't')
				.option('c', {
					alias: 'cache',
					describe: 'show template cache',
					boolean: true
				})
				.option('t', {
					alias: 'tpl',
					describe: 'show pre-define template',
					boolean: true
				})
				.example(`${getCmds()[0]} ls`, 'show all pre-define template')
		);
	},
	handler
};

module.exports = ls;
