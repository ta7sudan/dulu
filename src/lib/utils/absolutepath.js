'use strict';
const path = require('path');
function getAbsolutePath(project = '', dest = '') {
	if (dest && !project) {
		throw new Error('must set a project name');
	}

	let absolutePath = path.resolve(process.cwd(), dest, project);
	return absolutePath;
}

module.exports = getAbsolutePath;
