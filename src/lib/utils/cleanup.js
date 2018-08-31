'use strict';
const fs = require('fs-extra');
const path = require('path');

const cleaner = {
	createdNewDir: false,
	destination: '',
	set(key, value) {
		if (Object.prototype.hasOwnProperty.call(this, key)) {
			this[key] = value;
		}
	},
	async cleanup() {
		if (!this.destination) {
			return;
		}
		const dest = this.destination;

		if (this.createdNewDir) {
			await fs.remove(dest);
		} else {
			const entries = await fs.readdir(dest);
			for (var i = 0, len = entries.length; i < len; ++i) {
				await fs.remove(path.resolve(dest, entries[i]));
			}
		}
	}
};

module.exports = cleaner;
