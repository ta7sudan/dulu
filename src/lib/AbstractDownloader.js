'use strict';
const EventEmitter = require('events');
const {inherits} = require('util');
const {isAsyncFunction} = require('./utils');

function AbstractDownloader(opts) {
	const move = isAsyncFunction(opts.move)
		? opts.move
		: async function () {
			throw new Error('move is required and must be an async function.');
		};

	function F(src, dest) {
		const self = this instanceof F ? this : Object.create(F.prototype);
		if (typeof src !== 'string' || typeof dest !== 'string') {
			throw new TypeError('src and dest must be a string');
		}
		self.src = src;
		self.destination = dest;
		return self;
	}

	inherits(F, AbstractDownloader);

	F.prototype.start = async function () {
		this.emit('start');
		const rst = await move.call(this);
		if (rst) {
			this.emit('success');
		} else {
			this.emit('error');
		}
		return rst;
	};

	return F;
}

inherits(AbstractDownloader, EventEmitter);

module.exports = AbstractDownloader;
