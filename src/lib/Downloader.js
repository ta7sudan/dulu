'use strict';
const fs = require('fs-extra');
const chalk = require('chalk');
const AbstractDownloader = require('./AbstractDownloader');
const {downloadRepo} = require('./utils');

const Downloader = AbstractDownloader({
	async move() {
		const src = this.src,
			dest = this.destination;
		try {
			await fs.mkdirp(dest);
		} catch (err) {
			err.msg = `Can't create directory ${dest}.`;
			throw err;
		}

		try {
			await downloadRepo(src, dest);
		} catch (err) {
			err.msg = `Download template ${chalk.blue(src)} to ${chalk.blue(dest)} failed.`;
			throw err;
		}
		return true;
	}
});

module.exports = Downloader;
