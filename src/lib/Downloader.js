'use strict';
const AbstractDownloader = require('./AbstractDownloader');
const downloadRepo = require('./utils/download-repo');
const log = require('./utils/log');
const fs = require('fs-extra');

const Downloader = AbstractDownloader({
	async move() {
		const src = this.src,
			dest = this.destination;
		try {
			await fs.mkdirp(dest);
		} catch (err) {
			log.error(`Can't create directory ${dest}.`);
			throw err;
		}

		try {
			await downloadRepo(src, dest);
		} catch (err) {
			log.error(`Download template from ${src} to ${dest} failed.`);
			throw err;
		}
		return true;
	}
});

module.exports = Downloader;
