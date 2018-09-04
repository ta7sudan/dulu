'use strict';
const handler = require('../handlers/create');
const {getCmds} = require('../lib/utils');

const create = {
	command: 'create <template> [project]',
	desc: 'create new project from template',
	builder(yargs) {
		return yargs
			.option('d', {
				alias: 'destination',
				describe: 'path of the prarent dir of project',
				string: true
			})
			.option('c', {
				alias: 'cache',
				describe: 'cached template at $HOME/.dulu',
				boolean: true,
				default: false
			})
			.example(
				`${getCmds()[0]} create multicmd-cli myproject -d ~`,
				'create a project from multicmd-cli template in user home'
			);
	},
	handler
};

module.exports = create;
