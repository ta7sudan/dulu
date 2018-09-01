'use strict';
const fs = require('fs-extra');
const templateMap = require('./utils/template-map');
const LocalDownloader = require('./LocalDownloader');
const RemoteDownloader = require('./RemoteDownloader');
const getAbsolutePath = require('./utils/absolutepath');
const path = require('path');
const log = require('./utils/log');
const cleaner = require('./utils/cleanup');

async function createDownloader(template, project, dest) {
	const destination = getAbsolutePath(project, dest);
	const destinationParent = path.dirname(destination);
	let downloader = null;

	// 不要去创建多级目录, 省得出问题不好清理
	if (!(await fs.exists(destinationParent))) {
		log.error(`no such directory ${destinationParent}.`);
		process.exit(1);
	}

	if (project) {
		cleaner.set('createdNewDir', true);
	}

	if (templateMap[template]) {
		downloader = new LocalDownloader(templateMap[template], destination);
	} else {
		downloader = new RemoteDownloader(template, destination);
	}

	return downloader;
}

module.exports = createDownloader;
