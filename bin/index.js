#!/usr/bin/env node
'use strict';

const log = require('../src/lib/utils/log');
const semver = require('semver');
const {
	engines: {node: wanted},
	name
} = require('../package');

function checkNodeVersion(wanted, cliName) {
	const curNodeVersion = process.version;
	if (!semver.satisfies(curNodeVersion, wanted)) {
		log.error(
			`You are using Node ${curNodeVersion}, but this version of ${cliName} requires Node ${wanted}. Please upgrade your Node version.`
		);
		process.exit(1);
	}
}

checkNodeVersion(wanted, name);

require('../src/index');
