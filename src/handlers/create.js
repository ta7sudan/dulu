'use strict';
const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const ora = require('ora');
const createDownloader = require('../lib/create-downloader');
const Porter = require('../lib/Porter');
const generate = require('../lib/generate');
const {DULU_DIR, hasCache, parseTemplateName, getAbsolutePath, logger, cleaner} = require('../lib/utils');

async function create(argv) {
	const {template, project = '', destination = '', cache: shouldCache} = argv;
	const absoluteDest = getAbsolutePath(project, destination),
		destParent = path.dirname(absoluteDest),
		cacheDir = path.resolve(DULU_DIR, parseTemplateName(template));

	if (destination && !project) {
		logger.error('must set a project name.');
		process.exit(1);
	}

	// 不要去创建多级目录, 省得出问题不好清理
	if (!(await fs.pathExists(destParent))) {
		logger.error(`no such directory ${destParent}.`);
		process.exit(1);
	}

	// 假设所有可能创建的目录遇到异常都应该被清除
	if (project) {
		cleaner.mayCreateDir(absoluteDest);
	} else {
		cleaner.mayNotCreateDir(absoluteDest);
	}

	await fs.ensureDir(DULU_DIR);

	let downloader = null,
		spiner = ora(),
		lastTimeCached = hasCache(template),
		needCopyToDest = false;
	if (lastTimeCached) {
		downloader = new Porter(cacheDir, absoluteDest);
		spiner.text = 'Downloading template from cache...';
	} else if (shouldCache) {
		downloader = createDownloader(template, cacheDir);
		spiner.text = 'Downloading template to cache directory...\n';
		cleaner.mayCreateDir(cacheDir);
		needCopyToDest = true;
	} else {
		downloader = createDownloader(template, absoluteDest);
		spiner.text = 'Downloading template...\n';
	}
	downloader.on('start', () => spiner.start());
	downloader.on('success', () => spiner.succeed('Download template success.'));

	await downloader.start();

	if (needCopyToDest) {
		const porter = new Porter(cacheDir, absoluteDest),
			spn = ora(`Copy template to ${chalk.blue(absoluteDest)}`);
		porter.on('start', () => spn.start());
		porter.on('start', () => spn.succeed('Copy template success.'));
		await porter.start();
	}

	await generate(absoluteDest);
}

module.exports = create;
