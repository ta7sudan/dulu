'use strict';
const fs = require('fs-extra');
const path = require('path');

const cleaner = {
	maybeCreated: [],
	maybeNotCreated: [],
	mayCreateDir(dir) {
		this.maybeCreated.push(dir);
	},
	mayNotCreateDir(dir) {
		this.maybeNotCreated.push(dir);
	},
	rmFromMayCreate(dir) {
		const i = this.maybeCreated.indexOf(dir);
		if (~i) {
			this.maybeCreated.splice(i, 1);
		}
	},
	rmFromMayNotCreate(dir) {
		const i = this.maybeNotCreated.indexOf(dir);
		if (~i) {
			this.maybeNotCreated.splice(i, 1);
		}
	},
	async cleanUp() {
		for (const dest of this.maybeCreated) {
			if (await fs.pathExists(dest)) {
				await fs.remove(dest);
			}
		}

		for (const dest of this.maybeNotCreated) {
			const entries = await fs.readdir(dest);
			for (const item of entries) {
				await fs.remove(path.resolve(dest, item));
			}
		}
	}
};

module.exports = cleaner;
