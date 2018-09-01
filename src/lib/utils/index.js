'use strict';
const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const templateMap = require('./template-map');
const DULU_DIR = path.resolve(os.homedir(), '.dulu');
const TEMPLATES_DIR = path.resolve(__dirname, '../../../templates');
const TMP_DIR = path.resolve(DULU_DIR, 'tmp');

exports.isAsyncFunction = fn => fn[Symbol.toStringTag] === 'AsyncFunction';

exports.to = p => p.then(data => [null, data]).catch(err => [err, undefined]);

exports.sleep = time => new Promise(rs => setTimeout(rs, time));

exports.getAbsolutePath = (project = '', dest = '') => path.resolve(process.cwd(), dest, project);

exports.isInternalTemplate = name => !!templateMap[name];

exports.getInternalTemplate = template => path.resolve(TEMPLATES_DIR, templateMap[template]);

exports.hasCache = template => {
	return fs.pathExistsSync(path.resolve(DULU_DIR, template.replace(/[:/]/g, '-')));
};

exports.parseTemplateName = template => template.replace(/[:/]/g, '-');

exports.DULU_DIR = DULU_DIR;

exports.TEMPLATES_DIR = TEMPLATES_DIR;

exports.TMP_DIR = TMP_DIR;
