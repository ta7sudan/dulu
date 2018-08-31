'use strict';

function to(p) {
	return p.then(data => [null, data]).catch(err => [err, undefined]);
}

module.exports = to;
