'use strict';
const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const AbstractDownloader = require('./AbstractDownloader');

const Porter = AbstractDownloader({
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
			await fs.copy(src, dest, {
				filter(s) {
					// 去掉.git
					return path.basename(s) !== '.git';
				}
			});
		} catch (err) {
			err.msg = `Copy template from ${chalk.blue(src)} to ${chalk.blue(dest)} failed.`;
			throw err;
		}
		return true;
	}
});

module.exports = Porter;
