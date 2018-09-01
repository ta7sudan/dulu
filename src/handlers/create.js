'use strict';
const createDownloader = require('../lib/create-downloader');
const loadMeta = require('../lib/utils/load-meta');

async function create(argv) {
	// TODO, support cache option
	const {template, project, destination, cache} = argv;
	const downloader = await createDownloader(template, project, destination, cache);
	await downloader.start();
	await loadMeta(project, destination);
}

module.exports = create;
