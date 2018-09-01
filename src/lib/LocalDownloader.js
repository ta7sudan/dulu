'use strict';
const Downloader = require('./Downloader');
const fs = require('fs-extra');
const log = require('./utils/log');
const path = require('path');
const cleaner = require('./utils/cleanup');
const TEMPLATES_DIR = path.resolve(__dirname, '../../templates');

const LocalDownloader = Downloader({
	async download(template, dest) {
		const templateDir = path.resolve(TEMPLATES_DIR, template);

		try {
			await fs.mkdirp(dest);
			cleaner.set('destination', dest);
		} catch (err) {
			log.error(`Can't create directory ${dest}. Error message: ${err.message}`);
			throw err;
		}

		try {
			await fs.copy(templateDir, dest, {
				filter(src, dest) {
					// 去掉.git
					return path.basename(src) != '.git';
				}
			});
		} catch (err) {
			log.error(`Copy template to ${dest} failed. Error message: ${err.message}`);
			throw err;
		}
		return true;
	}
});

module.exports = LocalDownloader;
