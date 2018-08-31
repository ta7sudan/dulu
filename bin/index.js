#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const signale = require('signale');
const semver = require('semver');
const {
	engines: {node: wanted},
	name
} = require('../package');

function checkNodeVersion(wanted, cliName) {
	const curNodeVersion = process.version;
	if (!semver.satisfies(curNodeVersion, wanted)) {
		signale.error(
			chalk.red(
				`You are using Node ${curNodeVersion}, but this version of ${cliName} requires Node ${wanted}. Please upgrade your Node version.`
			)
		);
		process.exit(1);
	}
}

checkNodeVersion(wanted, name);

require('../src/index');
