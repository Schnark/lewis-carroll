/*global ZipBuilder: true*/
/*global TextEncoder, Blob, pako*/
ZipBuilder =
(function () {
"use strict";

var crc32table = (function () {
	/*jshint bitwise: false*/
	var i, j, t, table = [];
	for (i = 0; i < 256; i++) {
		t = i;
		for (j = 0; j < 8; j++) {
			if (t & 1) {
				t = (t >>> 1) ^ 0xedb88320;
			} else {
				t = t >>> 1;
			}
		}
		table[i] = t;
	}
	return table;
/*this is just not to break the stupid indention fixer*/})();

function calcCrc32 (data) {
	/*jshint bitwise: false*/
	var crc = -1 | 0, i;
	for (i = 0; i < data.length; i++) {
		crc = (crc >>> 8) ^ crc32table[(crc ^ data[i]) & 0xff];
	}
	/*jscs:disable disallowImplicitTypeConversion*/
	return ~crc;
	/*jscs:enable disallowImplicitTypeConversion*/
}

function encodeDate (date) {
	/*jshint bitwise: false*/
	var y = date.getFullYear() - 1980;
	if (y < 0 || y > 127) {
		throw new Error('Date out of range');
	}
	return (y << 25) +
		((date.getMonth() + 1) << 21) +
		(date.getDate() << 16) +
		(date.getHours() << 11) +
		(date.getMinutes() << 5) +
		Math.floor(date.getSeconds() / 2);
}

function createFileEntry (data, local) {
	var l, name, comment, buffer, view, offset;

	function writeUint32 (val) {
		view.setUint32(offset, val, true);
		offset += 4;
	}
	function writeUint16 (val) {
		view.setUint16(offset, val, true);
		offset += 2;
	}

	name = (new TextEncoder()).encode(data.name);
	comment = (new TextEncoder()).encode(data.comment);
	if (name.length > 0xffff) {
		throw new Error('Name too long');
	}
	if (data.extra.length > 0xffff) {
		throw new Error('Extra data too long');
	}
	if (comment.length > 0xffff) {
		throw new Error('Comment too long');
	}
	if (data.content.length > 0xffffffff) {
		throw new Error('Compressed size too big');
	}
	if (data.size > 0xffffffff) {
		throw new Error('Size too big');
	}
	if (data.offset > 0xffffffff) {
		throw new Error('Archive too big');
	}

	if (local) {
		l = 30 + name.length + data.extra.length + data.content.length;
	} else {
		l = 46 + name.length + data.extra.length + comment.length;
	}
	buffer = new ArrayBuffer(l);
	view = new DataView(buffer);
	offset = 0;

	writeUint32(local ? 0x04034b50 : 0x02014b50);
	if (!local) {
		writeUint16(data.version);
	}
	writeUint16(0x0014);
	writeUint16(0x0800 + [0, 6, 4, 0, 2][data.compression]);
	writeUint16(data.compression > 0 ? 8 : 0);
	writeUint32(encodeDate(data.date));
	writeUint32(data.crc);
	writeUint32(data.content.length);
	writeUint32(data.size);
	writeUint16(name.length);
	writeUint16(data.extra.length);
	if (!local) {
		writeUint16(comment.length);
		writeUint16(0);
		writeUint16(data.isText ? 1 : 0);
		writeUint32(data.attr);
		writeUint32(data.offset);
	}
	view = new Uint8Array(buffer);
	view.set(name, offset);
	offset += name.length;
	view.set(data.extra, offset);
	offset += data.extra.length;
	if (!local) {
		view.set(comment, offset);
	}
	if (local) {
		view.set(data.content, offset);
	}
	return buffer;
}

function createCentralDir (data) {
	var l, comment, buffer, view;
	/*
	The spec doesn't say anything on the encoding for the file comment. But the other comments
	only "should" use code page 437 unless explicitely marked as UTF-8, so I assume using
	UTF-8 here is frowned upon, but not strictly forbidden.
	*/
	comment = (new TextEncoder()).encode(data.comment);
	if (comment.length > 0xffff) {
		throw new Error('Comment too long');
	}
	l = 22 + comment.length;
	buffer = new ArrayBuffer(l);
	view = new DataView(buffer);
	view.setUint32(0, 0x06054b50, true);
	//view.setUint16(4, 0, true);
	//view.setUint16(6, 0, true);
	view.setUint16(8, data.count, true);
	view.setUint16(10, data.count, true);
	view.setUint32(12, data.size, true);
	view.setUint32(16, data.offset, true);
	view.setUint16(20, comment.length, true);
	view = new Uint8Array(buffer);
	view.set(comment, 22);
	return buffer;
}

function ZipBuilder (defaultData) {
	this.defaultData = defaultData || {};
	if (this.defaultData.compressionRate === undefined) {
		this.defaultData.compressionRate = 1;
	}
	if (this.defaultData.compressionLevel === undefined) {
		this.defaultData.compressionLevel = -1;
	}
	this.fileEntries = [];
	this.centralEntries = [];
	this.nextOffset = 0;
	this.size = 0;
}

ZipBuilder.prototype.addFile = function (data) {
	var zipData, pakoOptions, compressed, get;

	get = function (key, defaultValue) {
		if (data[key] !== undefined) {
			return data[key];
		}
		if (this.defaultData[key] !== undefined) {
			return this.defaultData[key];
		}
		return defaultValue;
	}.bind(this);

	if (this.fileEntries.length !== this.centralEntries.length) {
		throw new Error('Archive already closed');
	}
	if (this.fileEntries.length === 0xffff) {
		throw new Error('Too many files');
	}

	data = data || {};
	if (data.compressionRate === undefined) {
		data.compressionRate = this.defaultData.compressionRate;
	}
	if (data.compressionLevel === undefined) {
		data.compressionLevel = this.defaultData.compressionLevel;
	}

	zipData = {
		name: data.name || '',
		comment: get('comment', ''),
		extra: get('extra', []),
		date: get('date', new Date()),
		crc: calcCrc32(data.content || []),
		size: (data.content && data.content.length) || 0,
		isText: get('isText', false),
		version: get('version', 0x0014),
		attr: get('attr', get('isDir', !data.content) ? 0 : 0x10),
		offset: this.nextOffset
	};

	if (data.content && data.compressionRate > 0 && data.compressionLevel !== 0) {
		if (data.compressionLevel >= 1) {
			pakoOptions = {level: data.compressionLevel};
		}
		compressed = new Uint8Array(pako.deflateRaw(data.content, pakoOptions));
	}
	if (compressed && compressed.length < data.compressionRate * data.content.length) {
		zipData.content = compressed;
		switch (data.compressionLevel) {
		case 1:
			zipData.compression = 1;
			break;
		case 2:
			zipData.compression = 2;
			break;
		case 8:
		case 9:
			zipData.compression = 4;
			break;
		default:
			zipData.compression = 3;
		}
	} else {
		zipData.content = data.content || [];
		zipData.compression = 0;
	}

	this.fileEntries.push(createFileEntry(zipData, true));
	this.centralEntries.push(createFileEntry(zipData));
	this.nextOffset += this.fileEntries[this.fileEntries.length - 1].byteLength;
	this.size += this.centralEntries[this.centralEntries.length - 1].byteLength;
};

ZipBuilder.prototype.close = function (comment) {
	if (this.fileEntries.length !== this.centralEntries.length) {
		throw new Error('Archive already closed');
	}
	if (this.size > 0xffffffff) {
		throw new Error('Archive too big');
	}
	if (this.nextOffset > 0xffffffff) {
		throw new Error('Archive too big');
	}
	this.centralEntries.push(createCentralDir({
		comment: comment || '',
		count: this.fileEntries.length,
		size: this.size,
		offset: this.nextOffset
	}));
};

ZipBuilder.prototype.getCurrentCount = function () {
	return this.fileEntries.length;
};

ZipBuilder.prototype.getCurrentSize = function () {
	return this.nextOffset + this.size + 22;
};

ZipBuilder.prototype.getBlob = function () {
	if (this.fileEntries.length === this.centralEntries.length) {
		this.close();
	}
	return new Blob(this.fileEntries.concat(this.centralEntries), {
		type: 'application/zip'
	});
};

return ZipBuilder;
})();