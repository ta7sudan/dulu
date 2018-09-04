'use strict';
const Table = require('cli-table');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const templateMap = require('../lib/utils/template-map');
const {log, DULU_DIR} = require('../lib/utils');

function showInternalTemplate(tName) {
	const table = new Table({
		head: ['Template', 'URL'],
		colWidths: [30, 60],
		style: {
			head: ['yellow']
		}
	});
	const items = Object.keys(templateMap)
		.filter(name => (tName ? tName === name : true))
		.map(k => [k, templateMap[k]]);

	if (!items.length) {
		log.error('no such pre-define template.');
		process.exit(1);
	} else {
		table.push(...items);
		console.log(chalk.blue('\nPre-define templates:'));
		console.log(table.toString());
	}
}

async function showCache() {
	console.log(chalk.blue(`\nCache in ${DULU_DIR}:`));
	if (await fs.pathExists(DULU_DIR)) {
		const entries = await fs.readdir(DULU_DIR);
		if (!entries.length) {
			console.log(chalk.yellow('None.'));
		}
		for (const item of entries) {
			if ((await fs.lstat(path.resolve(DULU_DIR, item))).isDirectory()) {
				console.log(`${chalk.yellow('-')} ${item}`);
			}
		}
	} else {
		console.log(chalk.yellow('None.'));
	}
}

async function ls(argv) {
	const {tpl, cache, template} = argv;

	if (tpl && !cache) {
		showInternalTemplate(template);
	} else if (cache && !tpl) {
		await showCache();
	} else {
		showInternalTemplate(template);
		await showCache();
	}
}

module.exports = ls;
