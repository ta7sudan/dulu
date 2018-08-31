'use strict';
const ora = require('ora');
const EventEmmiter = require('events');

function isAsyncFunction(fn) {
	return fn[Symbol.toStringTag] === 'AsyncFunction';
}

function Downloader(opts) {
	const spinerMap = new WeakMap();

	function startLoading() {
		const spiner = spinerMap.get(this);
		spiner.start();
	}

	function downloadSuccess() {
		const spiner = spinerMap.get(this);
		spiner.succeed('Done.');
	}

	const download = isAsyncFunction(opts.download)
		? opts.download
		: async function () {
			throw new Error('download is required and must be an async function.');
		};

	function F(template, dest) {
		const self = this instanceof F ? this : Object.create(F.prototype);
		// private
		const spiner = ora('Downloading template...\n');
		spinerMap.set(self, spiner);
		// public
		self.template = template;
		self.dest = dest;
		self.completed = false;
		return self;
	}

	F.prototype = Object.create(Downloader.prototype);

	F.prototype.start = async function () {
		startLoading.call(this);
		await download(this.template, this.dest);
		downloadSuccess.call(this);
		this.emit('downloadCompleted');
	};

	return F;
}

Downloader.prototype = Object.create(EventEmmiter.prototype);

module.exports = Downloader;
