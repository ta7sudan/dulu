'use strict';
const createDownloader = require('../lib/create-downloader');
const cleaner = require('../lib/utils/cleanup');
const generate = require('../lib/generate');
const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const ora = require('ora');
const log = require('../lib/utils/log');
const {DULU_DIR, TMP_DIR, hasCache, parseTemplateName, getAbsolutePath} = require('../lib/utils');

async function create(argv) {
	const {template, project = '', destination, cache: shouldCache} = argv;
	const absoluteDest = getAbsolutePath(project, destination),
		destParent = path.dirname(absoluteDest),
		cacheDir = path.resolve(DULU_DIR, parseTemplateName(template));

	// await sleep(10000);
	if (destination && !project) {
		log.error('must set a project name.');
		process.exit(1);
	}

	// 不要去创建多级目录, 省得出问题不好清理
	if (!(await fs.pathExists(destParent))) {
		log.error(`no such directory ${destParent}.`);
		process.exit(1);
	}

	// 假设所有可能创建的目录遇到异常都应该被清除
	if (project) {
		cleaner.mayCreateDir(absoluteDest);
	} else {
		cleaner.mayNotCreateDir(absoluteDest);
	}
	cleaner.mayCreateDir(cacheDir);
	cleaner.mayCreateDir(TMP_DIR);

	fs.ensureDir(DULU_DIR);

	if (hasCache(template)) {
		// 如果已经有缓存那就不清除缓存
		cleaner.rmFromMayCreate(cacheDir);
		await generate(cacheDir, absoluteDest);
	} else {
		const downloader = createDownloader(template, cacheDir),
			spiner = ora('Downloading template...\n');

		downloader.on('start', () => {
			spiner.start();
		});
		downloader.on('success', () => {
			spiner.succeed('Done.');
		});
		await downloader.start();

		// 如果已经生成缓存并且应当缓存那就不清除缓存目录了
		if (shouldCache) {
			cleaner.rmFromMayCreate(cacheDir);
		}

		await generate(cacheDir, absoluteDest);
	}


	if (project) {
		cleaner.rmFromMayCreate(absoluteDest);
	} else {
		cleaner.rmFromMayNotCreate(absoluteDest);
	}

	// clean up tmp
	try {
		await cleaner.cleanup();
	} catch (err) {
		log.error(err.message);
		console.error(chalk.red(err.stack));
		process.exit(1);
	}
}

module.exports = create;
