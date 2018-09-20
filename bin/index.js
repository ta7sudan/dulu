#!/usr/bin/env node
'use strict';

const semver = require('semver');
const {logger, getCmds} = require('../src/lib/utils');
const {
	engines: {node: wanted}
} = require('../package');

function checkNodeVersion(wanted, cliName) {
	const curNodeVersion = process.version;
	if (!semver.satisfies(curNodeVersion, wanted)) {
		logger.error(
			`You are using Node ${curNodeVersion}, but this version of ${cliName} requires Node ${wanted}. Please upgrade your Node version.`
		);
		process.exit(1);
	}
}

checkNodeVersion(wanted, getCmds()[0]);

require('../src/index');
