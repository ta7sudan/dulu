'use strict';
const figlet = require('figlet');
const dld = require('download-git-repo');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const {bin} = require('../../../package');
const templateMap = require('./template-map');
const logger = require('./logger');

const DULU_DIR = path.resolve(os.homedir(), '.dulu');
const TEMPLATES_DIR = path.resolve(__dirname, '../../../templates');

exports.isAsyncFunction = fn => fn[Symbol.toStringTag] === 'AsyncFunction';

exports.to = p => p.then(data => [null, data]).catch(err => [err, undefined]);

exports.sleep = time => new Promise(rs => setTimeout(rs, time));

exports.getAbsolutePath = (project = '', dest = '') => path.resolve(process.cwd(), dest, project);

exports.isInternalTemplate = name => !!templateMap[name];

exports.getInternalTemplate = template =>
	path.resolve(TEMPLATES_DIR, path.basename(templateMap[template]));

exports.hasCache = template =>
	fs.pathExistsSync(path.resolve(DULU_DIR, template.replace(/[:/]/g, '-')));

exports.parseTemplateName = template => template.replace(/[:/]/g, '-');

exports.getCmds = () => Object.keys(bin);

exports.getFiglet = cmd =>
	new Promise((rs, rj) => {
		figlet(
			cmd,
			{
				horizontalLayout: 'fitted'
			},
			(err, data) => {
				if (err) {
					rj(err);
				} else {
					rs(data);
				}
			}
		);
	});

exports.downloadRepo = (repo, dest) =>
	new Promise((rs, rj) => {
		dld(repo, dest, err => (err ? rj(err) : rs()));
	});

exports.logger = logger;

exports.DULU_DIR = DULU_DIR;

exports.TEMPLATES_DIR = TEMPLATES_DIR;
