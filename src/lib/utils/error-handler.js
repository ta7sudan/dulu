'use strict';
const cleaner = require('./cleanup');
const signale = require('signale');
const chalk = require('chalk');
const ora = require('ora');

async function handleExit() {
	const spiner = ora('do clean up...').start();
	try {
		await cleaner.cleanup();
		spiner.succeed('clean up done.');
	} catch (e) {
		signale.error(chalk.red(`Can't remove ${cleaner.destination}. Error message: ${e.message}`));
		console.error(chalk.red(e.stack));
		process.exit(1);
	}
	signale.success('Exiting without error.');
	process.exit();
}

async function handleError(e) {
	console.error(chalk.red(e.stack));
	const spiner = ora('do clean up...').start();
	try {
		await cleaner.cleanup();
		spiner.succeed('clean up done.');
	} catch (err) {
		signale.error(chalk.red(`Can't remove ${cleaner.destination}. Error message: ${e.message}`));
		console.error(chalk.red(err.stack));
	}
	process.exit(1);
}

process.addListener('SIGINT', handleExit);
process.addListener('SIGTERM', handleExit);

process.addListener('uncaughtException', handleError);

module.exports = handleError;
