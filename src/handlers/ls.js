'use strict';
const Table = require('cli-table');
const templateMap = require('../lib/utils/template-map');

function ls(argv) {
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

module.exports = ls;
