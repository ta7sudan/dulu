'use strict';
const {name: cmdName} = require('../../package');
const createDownloader = require('../lib/create-downloader');
const loadMeta = require('../lib/utils/load-meta');

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
				`${cmdName} create multicmd-cli myproject -d ~`,
				'create a project from multicmd-cli template in user home'
			);
	},
	async handler(argv) {
		// TODO, support cache option
		const {template, project, destination, cache} = argv;
		const downloader = await createDownloader(template, project, destination, cache);
		await downloader.start();
		await loadMeta(project, destination);
	}
};

module.exports = create;
