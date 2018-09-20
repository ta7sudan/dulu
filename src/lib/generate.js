'use strict';
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const ora = require('ora');
const artTpl = require('art-template');
const inquirer = require('inquirer');
const glob = require('fast-glob');
const {logger} = require('./utils');

artTpl.defaults.debug = false;
artTpl.defaults.bail = true;
artTpl.defaults.minimize = false;
artTpl.defaults.onerror = err => {
	throw err;
};

async function excludeFiles(dest, excludes) {
	const entries = await glob(`+(${excludes.join('|')})`, {
			cwd: dest,
			absolute: true,
			dot: true
		}),
		rm = [];

	for (const item of entries) {
		rm.push(fs.remove(item));
	}
	await Promise.all(rm);
}

async function renderTemplates(dest, templates, data) {
	const tplFiles = await glob(`+(${templates.join('|')})`, {
			cwd: dest,
			absolute: true,
			dot: true
		}),
		rd = [];

	for (const file of tplFiles) {
		rd.push(
			fs.readFile(file, {
				encoding: 'utf8'
			})
		);
	}
	const contents = await Promise.all(rd);

	for (let i = 0, len = tplFiles.length; i < len; ++i) {
		const newContent = artTpl.render(contents[i], data);
		await fs.writeFile(tplFiles[i], newContent, {
			encoding: 'utf8'
		});
	}
}

async function transformFiles(dest, files) {
	const hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
	for (const key in files) {
		if (hasOwnProperty(files, key)) {
			const src = path.resolve(dest, key),
				target = path.resolve(dest, files[key]);
			if (await fs.pathExists(target)) {
				throw new Error(`${chalk.blue(files[key])} already exists. do you wanted to override it?`);
			} else {
				await fs.move(src, target);
			}
		}
	}
}

async function generate(dest) {
	const projectName = path.basename(dest),
		metaPath = path.resolve(dest, '.dulu.js'),
		spiner = ora('Generating template...\n');

	if (!(await fs.pathExists(metaPath))) {
		logger.warn(`.dulu.js not found. Just download template at ${dest}`);
		return;
	}

	const dulu = require(metaPath);
	if (typeof dulu !== 'function') {
		throw new TypeError('.dulu.js must export a function.');
	}

	const {prompts, complete} = dulu(projectName);

	if (!Array.isArray(prompts)) {
		throw new TypeError('prompts must be an Array of Object.');
	}

	if (typeof complete !== 'function') {
		throw new TypeError('complete must be a function.');
	}

	// inquirer中谜之不能捕获到SIGINT信号, 可能导致模板被缓存...
	const answers = await inquirer.prompt(prompts);

	const {excludes, templates, transform} = complete(answers);

	spiner.start();

	if (!Array.isArray(excludes) || !Array.isArray(templates)) {
		throw new TypeError('excludes and templates must be an Array of string');
	}

	await excludeFiles(dest, excludes);

	await renderTemplates(dest, templates, answers);

	if (Object.prototype.toString.call(transform) === '[object Object]') {
		await transformFiles(dest, transform);
	}

	spiner.stop();
	logger.success(`Project created at ${dest}. Enjoy!`);
}

module.exports = generate;
