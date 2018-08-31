'use strict';
const getAbsolutePath = require('./absolutepath');
const fs = require('fs-extra');
const path = require('path');
const signale = require('signale');
const ora = require('ora');
const template = require('art-template');
const inquirer = require('inquirer');
const chalk = require('chalk');

async function loadMeta(project, dest) {
	const destination = getAbsolutePath(project, dest);
	const metaPath = path.resolve(destination, '.dulu.js');
	if (!(await fs.pathExists(metaPath))) {
		signale.note(`.dulu.js not found. Just download template at ${destination}`);
		return;
	}
	const dulu = require(metaPath);
	/* global sleep */
	await sleep(10000);
	await dulu({
		fs,
		signale,
		ora,
		template,
		inquirer,
		chalk
	});
}

module.exports = loadMeta;
