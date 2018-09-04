'use strict';
const fs = require('fs-extra');
const path = require('path');
const {log, getCmds, parseTemplateName, DULU_DIR} = require('../lib/utils');

const ls = {
	command: 'clear [template]',
	desc: 'clear template cache',
	builder(yargs) {
		return yargs
			.option('a', {
				alias: 'all',
				describe: 'clear all template cache',
				boolean: true
			})
			.example(`${getCmds()[0]} clear multicmd-cli`, 'clear cache of multicmd-cli');
	},
	async handler(argv) {
		const {all, template} = argv;
		if (!all && !template) {
			log.error("clear should be 'clear -a' or 'clear <template>'");
			process.exit(1);
		}

		if (all && (await fs.pathExists(DULU_DIR))) {
			await fs.remove(DULU_DIR);
			log.success('OK.');
		} else if (template) {
			const templatePath = path.resolve(DULU_DIR, parseTemplateName(template));
			if (await fs.pathExists(templatePath)) {
				await fs.remove(templatePath);
				log.success('OK.');
			} else {
				log.error('no such template cache.');
				process.exit(1);
			}
		} else {
			log.success('OK.');
		}
	}
};

module.exports = ls;
