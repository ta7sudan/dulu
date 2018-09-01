'use strict';
const signale = require('signale');
const chalk = require('chalk');

exports.error = msg => signale.error(chalk.red(msg));

exports.success = signale.success;

exports.note = signale.note;
