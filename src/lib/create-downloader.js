'use strict';
const Porter = require('./Porter');
const Downloader = require('./Downloader');
const {getInternalTemplate, isInternalTemplate} = require('./utils');

function createDownloader(template, dest) {
	let downloader = null;
	if (isInternalTemplate(template)) {
		downloader = new Porter(getInternalTemplate(template), dest);
	} else {
		downloader = new Downloader(template, dest);
	}

	return downloader;
}

module.exports = createDownloader;
