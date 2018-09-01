'use strict';
const AbstractDownloader = require('./AbstractDownloader');
const fs = require('fs-extra');
const path = require('path');
const log = require('./utils/log');

const Porter = AbstractDownloader({
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
			await fs.copy(src, dest, {
				filter(s) {
					// 去掉.git
					return path.basename(s) != '.git';
				}
			});
		} catch (err) {
			log.error(`Copy template from ${src} to ${dest} failed.`);
			throw err;
		}
		return true;
	}
});

module.exports = Porter;