'use strict';
const log = require('./utils/log');
const fs = require('fs-extra');
const Downloader = require('./Downloader');
const download = require('./utils/download');
const cleaner = require('./utils/cleanup');

const RemoteDownloader = Downloader({
	async download(template, dest) {
		try {
			await fs.mkdirp(dest);
			cleaner.set('destination', dest);
		} catch (err) {
			log.error(`Can't create directory ${dest}. Error message: ${err.message}`);
			throw err;
		}

		try {
			await download(template, dest);
		} catch (err) {
			log.error(`Download template to ${dest} failed. Error message: ${err.message}`);
			throw err;
		}
		return true;
	}
});

module.exports = RemoteDownloader;
