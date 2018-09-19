'use strict';
require('./lib/utils/safe-promise');

const yargs = require('yargs');
const yargonaut = require('yargonaut');
const chalk = require('chalk');
const {version, author} = require('../package');
const {handleError, handleExit} = require('./lib/utils/error-handler');
const {getCmds, getFiglet} = require('./lib/utils');

process.addListener('SIGINT', handleExit);
process.addListener('SIGTERM', handleExit);
process.addListener('uncaughtException', handleError);

(async () => {
	const cmdName = getCmds()[0],
		logo = await getFiglet(cmdName);
	yargs.logo = logo;
	yargonaut
		.helpStyle('blue.underline')
		.style('red.bold', 'required')
		.style('magenta', ['boolean', 'string']);

	yargs
		.scriptName(cmdName)
		.commandDir('./commands')
		.recommendCommands()
		.completion('completion', 'get completion script')
		.alias('h', 'help')
		.alias('v', 'version')
		.example(`${cmdName} create multicmd-cli myproject`, 'create a project from multicmd-cli template')
		.usage(`${chalk.yellowBright(logo)}\n\n${chalk.blue.underline('Usage:')} ${cmdName} <command> [options]`)
		.version(version)
		.epilog(`By ${author}`)
		.help()
		.fail((msg, err, yargs) => {
			// 这个坑爹东西会捕获掉所有同步异常, 子命令的fail还会向上一级命令的fail冒泡
			if (err) {
				handleError(err);
			} else {
				// 处理子命令不带参数
				yargs.showHelp();
			}
		});

	const argv = yargs.argv;

	// 没有参数或子命令就显示help
	if (!argv._.length) {
		yargs.showHelp();
	}
})();
