'use strict';
const fs = require('fs-extra');
const path = require('path');
const {logger, getCmds, parseTemplateName, DULU_DIR} = require('../lib/utils');

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
			logger.error("clear should be 'clear -a' or 'clear <template>'");
			process.exit(1);
		}

		if (all && (await fs.pathExists(DULU_DIR))) {
			await fs.remove(DULU_DIR);
			logger.success('OK.');
		} else if (template) {
			const templatePath = path.resolve(DULU_DIR, parseTemplateName(template));
			if (await fs.pathExists(templatePath)) {
				await fs.remove(templatePath);
				logger.success('OK.');
			} else {
				logger.error('no such template cache.');
				process.exit(1);
			}
		} else {
			logger.success('OK.');
		}
	}
};

module.exports = ls;
