'use strict';
const d = require('download-git-repo');

function download(repo, dest) {
	return new Promise((rs, rj) => {
		d(repo, dest, err => {
			if (err) {
				rj(err);
			} else {
				rs();
			}
		});
	});
}

module.exports = download;
