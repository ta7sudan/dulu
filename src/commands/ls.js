'use strict';

const Table = require('cli-table');
const templateMap = require('../lib/utils/template-map');
const {name: cmdName} = require('../../package');

const ls = {
	command: 'ls [template]',
	desc: 'list available pre-define template',
	builder(yargs) {
		return yargs.example(`${cmdName} ls`, 'show all pre-define template');
	},
	handler(argv) {
		const {template} = argv;
		const table = new Table({
			head: ['Template', 'URL'],
			colWidths: [30, 60],
			style: {
				head: ['yellow']
			}
		});
		const items = Object.keys(templateMap)
			.filter(name => (template ? template === name : true))
			.map(k => [k, templateMap[k]]);
		table.push(...items);
		console.log(table.toString());
	}
};

module.exports = ls;
