'use strict';

const handler = require('../handlers/ls');
const {getCmds} = require('../lib/utils');

const ls = {
	command: 'ls [template]',
	desc: 'list available predefined template or cache',
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
					describe: 'show predefined template',
					boolean: true
				})
				.example(`${getCmds()[0]} ls`, 'show all predefined template')
		);
	},
	handler
};

module.exports = ls;
