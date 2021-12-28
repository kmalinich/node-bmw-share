/* eslint no-console: 0 */

const caller   = require('callers-path');
const path     = require('path');
const trucolor = require('trucolor');

// 24bit color chalk-style palette
const chalk = (0, trucolor.chalkish)((0, trucolor.palette)({}, {
	black  : 'rgb:48,48,48',
	blue   : 'rgb:51,152,219',
	cyan   : 'rgb:0,200,200',
	green  : 'rgb:47,223,100',
	gray   : 'rgb:172,172,172',
	orange : 'rgb:255,153,50',
	pink   : 'rgb:178,0,140',
	purple : 'rgb:114,83,178',
	red    : 'rgb:231,76,60',
	white  : 'rgb:224,224,224',
	yellow : 'rgb:255,204,50',

	boldblack  : 'bold rgb:48,48,48',
	boldblue   : 'bold rgb:51,152,219',
	boldcyan   : 'bold rgb:0,200,200',
	boldgreen  : 'bold rgb:47,223,100',
	boldgray   : 'bold rgb:172,172,172',
	boldorange : 'bold rgb:255,153,50',
	boldpink   : 'bold rgb:178,0,140',
	boldpurple : 'bold rgb:114,83,178',
	boldred    : 'bold rgb:231,76,60',
	boldwhite  : 'bold rgb:224,224,224',
	boldyellow : 'bold rgb:255,204,50',

	italicblack  : 'italic rgb:48,48,48',
	italicblue   : 'italic rgb:51,152,219',
	italiccyan   : 'italic rgb:0,200,200',
	italicgreen  : 'italic rgb:47,223,100',
	italicgray   : 'italic rgb:172,172,172',
	italicorange : 'italic rgb:255,153,50',
	italicpink   : 'italic rgb:178,0,140',
	italicpurple : 'italic rgb:114,83,178',
	italicred    : 'italic rgb:231,76,60',
	italicwhite  : 'italic rgb:224,224,224',
	italicyellow : 'italic rgb:255,204,50',
}));


// If     in a TTY, output to stdout
// If NOT in a TTY, only output to stdout if config.console.output is true
function stdoutOK() {
	return process.stdout._type === 'tty' || config?.console?.output;
} // stdoutOK()


// Reorganize log message data if needed
function prepData(data) {
	// Account for older format
	if (typeof data === 'object' && typeof data.msg === 'undefined') {
		data = { msg : data };
	}

	// Handle single-string input
	if (typeof data === 'string') data = { msg : data };

	return data;
} // prepData(data)


// Space-pad a string on both ends to center it
function center(string, length) {
	const character = ' ';

	string = string.toString();
	length  = parseInt(length);

	while (string.length < length) {
		string = character + string;
		if (string.length < length) string += character;
	}

	return string;
} // center(string, length)

// FYI: The string.replace commands are in a specific order for a specific reason
function colorize(string) {
	string = string.toString();

	// Purple
	string = string.replace('Event:', chalk.purple('Event:'));

	// Yellow
	string = string.replace('Attempting',    chalk.yellow('Attempting'));
	string = string.replace('Checking',      chalk.yellow('Checking'));
	string = string.replace('Closing',       chalk.yellow('Closing'));
	string = string.replace('Configuring',   chalk.yellow('Configuring'));
	string = string.replace('Connecting',    chalk.yellow('Connecting'));
	string = string.replace('Ending',        chalk.yellow('Ending'));
	string = string.replace('Initializing',  chalk.yellow('Initializing'));
	string = string.replace('Instantiating', chalk.yellow('Instantiating'));
	string = string.replace('Opening',       chalk.yellow('Opening'));
	string = string.replace('Reconnecting',  chalk.yellow('Reconnecting'));
	string = string.replace('Removing',      chalk.yellow('Removing'));
	string = string.replace('Resetting',     chalk.yellow('Resetting'));
	string = string.replace('Setting',       chalk.yellow('Setting'));
	string = string.replace('Shutting down', chalk.yellow('Shutting down'));
	string = string.replace('Starting',      chalk.yellow('Starting'));
	string = string.replace('Stopping',      chalk.yellow('Stopping'));
	string = string.replace('Terminating',   chalk.yellow('Terminating'));

	// Red
	string = string.replace(' close',        chalk.red(' close'));
	string = string.replace(' closed',       chalk.red(' closed'));
	string = string.replace('Closed',        chalk.red('Closed'));
	string = string.replace(' disconnected', chalk.red(' disconnected'));
	string = string.replace('Disconnected',  chalk.red('Disconnected'));
	string = string.replace('Error',         chalk.red('Error'));
	string = string.replace(' error',        chalk.red(' error'));
	string = string.replace('Failed ',       chalk.red('Failed '));
	string = string.replace('Removed',       chalk.red('Removed'));
	string = string.replace('SIGINT',        chalk.red('SIGINT'));
	string = string.replace('SIGTERM',       chalk.red('SIGTERM'));
	string = string.replace('Shut down',     chalk.red('Shut down'));
	string = string.replace('Stopped',       chalk.red('Stopped'));
	string = string.replace('Terminated',    chalk.red('Terminated'));
	string = string.replace(' not ready',    chalk.red(' not ready'));
	string = string.replace('Unset',         chalk.red('Unset'));
	string = string.replace('error',         chalk.red('error'));
	string = string.replace('false',         chalk.red('false'));

	// Green
	string = string.replace(' OK',          chalk.green(' OK'));
	string = string.replace(' connected',   chalk.green(' connected'));
	string = string.replace(' opened',      chalk.green(' opened'));
	string = string.replace(' ready',       chalk.green(' ready'));
	string = string.replace('Configured',   chalk.green('Configured'));
	string = string.replace('Connected ',   chalk.green('Connected '));
	string = string.replace('Initialized',  chalk.green('Initialized'));
	string = string.replace('Instantiated', chalk.green('Instantiated'));
	string = string.replace('Listening ',   chalk.green('Listening '));
	string = string.replace('Loaded ',      chalk.green('Loaded '));
	string = string.replace('Opened',       chalk.green('Opened'));
	string = string.replace('Read ',        chalk.green('Read '));
	string = string.replace('Reset ',       chalk.green('Reset '));
	string = string.replace('Set ',         chalk.green('Set '));
	string = string.replace('Started',      chalk.green('Started'));
	string = string.replace('Wrote',        chalk.green('Wrote'));
	string = string.replace('listening ',   chalk.green('listening '));
	string = string.replace('true',         chalk.green('true'));

	return string;
} // colorize(string)

// Colorize data source string by name
function colorizeBySource(orig, fmt) {
	switch (orig) {
		case 'host-data' : return chalk.green(fmt);
		case 'json'      : return chalk.purple(fmt);
		case 'gpio'      : return chalk.red(fmt);
		case 'power'     : return chalk.red(fmt);
		case 'kodi'      : return chalk.cyan(fmt);
		case 'socket'    : return chalk.orange(fmt);
		case 'api'       : return chalk.orange(fmt);

		default : return chalk.yellow(fmt);
	}
} // colorizeBySource(orig, fmt)


// Dynamic bus message output
function logBus(data) {
	// Bounce if we're not supposed to write to stdout
	if (stdoutOK() !== true) return;

	// Skip some excessive loggers
	switch (data.value) {
		case 'sensor status' : return;
		case 'speed values'  : return;
	}

	// Add dst by mirroring src if dst is missing
	if (typeof data.dst === 'undefined' || data.dst === null) {
		data.dst = {
			name : data.src.name,
		};
	}

	data.topic = data.command;

	// Save original strings
	data.bus_orig      = data.bus;
	data.src.name_orig = data.src.name;
	data.dst.name_orig = data.dst.name;
	data.topic_orig    = data.topic;

	// Format bus
	data.bus = data.bus.charAt(0).toUpperCase() + data.bus.charAt(1).toUpperCase();

	// Format command
	switch (data.topic_orig) {
		case 'ack' : data.topic = 'ACK';       break;
		case 'bro' : data.topic = 'BROADCAST'; break;
		case 'con' : data.topic = 'CONTROL';   break;
		case 'rep' : data.topic = 'REPLY';     break;
		case 'req' : data.topic = 'REQUEST';   break;
		case 'sta' : data.topic = 'STATUS';    break;
		case 'upd' : data.topic = 'UPDATE';    break;
		case 'unk' :
		default    :
			data.topic = 'UNKNOWN';

			switch (data.bus_orig) {
				case 'can0' :
				case 'can1' : data.value = hex.i2s(data.src.id, true, 3); break;

				default : data.value = hex.i2s(data.msg[0]);
			}
	}

	// Pad strings
	data.bus      = data.bus.padStart(2);
	data.dst.name = data.dst.name_orig.padEnd(10);
	data.src.name = data.src.name_orig.padStart(9);
	data.topic    = center(data.topic, 9);

	// Colorize source and destination
	data.src.name = chalk.yellow(data.src.name);
	data.dst.name = chalk.green(data.dst.name);

	// Colorize bus
	switch (data.bus_orig) {
		case 'can0' : data.bus = chalk.orange('C0'); break;
		case 'can1' : data.bus = chalk.orange('C1'); break;
		case 'dbus' : data.bus = chalk.red('DB');    break;
		case 'ibus' : data.bus = chalk.cyan('IB');   break;
		case 'kbus' : data.bus = chalk.yellow('KB'); break;
		case 'node' : data.bus = chalk.purple('ND'); break;
		default     : data.bus = chalk.pink(data.bus);
	}

	// Colorize command
	switch (data.topic_orig) {
		case 'ack' : data.topic = chalk.green(data.topic);  break;
		case 'bro' : data.topic = chalk.purple(data.topic); break;
		case 'con' : data.topic = chalk.red(data.topic);    break;
		case 'rep' : data.topic = chalk.green(data.topic);  break;
		case 'req' : data.topic = chalk.cyan(data.topic);   break;
		case 'sta' :
		case 'upd' : data.topic = chalk.blue(data.topic); break;
		default    : data.topic = chalk.yellow(data.topic);
	}

	// Replace and colorize true/false
	data.value = chalk.gray(data.value);
	data.value = data.value.toString().replace('true', chalk.green('true')).replace('false', chalk.red('false'));

	// Render gray arrows
	const arrows = chalk.gray('>>');

	// Output formatted string
	console.log('[%s] [%s%s%s] [%s]', data.bus, data.src.name, arrows, data.dst.name, data.topic, data.value);

	// Send log data to WebSocket
	typeof api !== 'undefined' && api.emit('log-tx', data);
} // logBus(data)

// Formatted output for when a value changes
function logChange(data) {
	// Bounce if we're not supposed to write to stdout
	if (stdoutOK() !== true) return;

	data.topic = 'CHANGE';

	data.src = path.parse(caller()).name;

	// Pad strings
	data.src_fmt   = center(data.src,  21);
	data.topic_fmt = center(data.topic, 9);

	// Catch nulls
	if (typeof data.old === 'undefined' || data.old === null) data.old = 'null';
	if (typeof data.new === 'undefined' || data.new === null) data.new = 'null';

	// Colorize strings
	data.src_fmt   = chalk.blue(data.src_fmt);
	data.topic_fmt = chalk.cyan(data.topic_fmt);
	data.old       = chalk.red(data.old.toString());
	data.new       = chalk.green(data.new.toString());

	// Replace and colorize true/false
	data.old = data.old.toString().replace('true', chalk.green('true')).replace('false', chalk.red('false'));
	data.new = data.new.toString().replace('true', chalk.green('true')).replace('false', chalk.red('false'));

	// Output formatted string
	data.bus = chalk.blue('CH');
	console.log('[%s] [%s] [%s] %s: \'%s\'', data.bus, data.src_fmt, data.topic_fmt, data.value, data.new);

	// Send log data to WebSocket
	typeof api !== 'undefined' && api.emit('log-tx', data);
} // logChange(data)

function logError(data) {
	// Prepare log data
	data = prepData(data);

	data.src = path.parse(caller()).name;

	data.src_orig = data.src;

	data.topic = 'ERROR';

	// Pad strings
	data.src_fmt   = center(data.src,  21);
	data.topic_fmt = center(data.topic, 9);

	// Colorize strings
	data.topic_fmt = chalk.red(data.topic_fmt);
	data.src_fmt   = chalk.red(data.src_fmt);

	data.msg_fmt = data.msg;

	// Output formatted string
	data.bus = chalk.red('ER');
	console.log('[%s] [%s] [%s] %s', data.bus, data.src_fmt, data.topic_fmt, data.msg_fmt);

	// Send log data to WebSocket
	typeof api !== 'undefined' && api.emit('log-tx', data);
} // logError(data)

function logLib(data) {
	// Bounce if we're not supposed to write to stdout
	if (stdoutOK() !== true) return;

	// Prepare log data
	data = prepData(data);

	data.src = path.parse(caller()).name;

	data.src_orig = data.src;

	data.topic = 'LIBRARY';

	// Pad strings
	data.src_fmt   = center(data.src,  21);
	data.topic_fmt = center(data.topic, 9);

	// Colorize strings
	data.src_fmt   = colorizeBySource(data.src_orig, data.src_fmt);
	data.topic_fmt = chalk.orange(data.topic_fmt);

	data.msg_fmt = data.msg;
	// Only colorize log message if it is a string
	if (typeof data.msg_fmt === 'string') {
		data.msg_fmt = chalk.gray(data.msg_fmt);
		data.msg_fmt = colorize(data.msg_fmt);
	}

	// Output formatted string
	data.bus = chalk.purple('LB');
	console.log('[%s] [%s] [%s] %s', data.bus, data.src_fmt, data.topic_fmt, data.msg_fmt);

	// Send log data to WebSocket
	typeof api !== 'undefined' && api.emit('log-tx', data);
} // logLib(data)

function logMsg(data) {
	// Bounce if we're not supposed to write to stdout
	if (stdoutOK() !== true) return;

	// Prepare log data
	data = prepData(data);

	data.src = path.parse(caller()).name;

	data.src_orig = data.src;

	data.topic = 'MESSAGE';

	// Pad strings
	data.src_fmt   = center(data.src,  21);
	data.topic_fmt = center(data.topic, 9);

	// Colorize strings
	data.src_fmt   = colorizeBySource(data.src_orig, data.src_fmt);
	data.topic_fmt = chalk.gray(data.topic_fmt);

	data.msg_fmt = data.msg;
	// Only colorize log message if it is a string
	if (typeof data.msg_fmt === 'string') {
		data.msg_fmt = chalk.gray(data.msg_fmt);
		data.msg_fmt = colorize(data.msg_fmt);
	}

	// Output formatted string
	data.bus = chalk.gray('ND');
	console.log('[%s] [%s] [%s] %s', data.bus, data.src_fmt, data.topic_fmt, data.msg_fmt);

	// Send log data to WebSocket
	typeof api !== 'undefined' && api.emit('log-tx', data);
} // logMsg(data)

function logModule(data) {
	// Bounce if we're not supposed to write to stdout
	if (stdoutOK() !== true) return;

	// Prepare log data
	data = prepData(data);

	data.src = path.parse(caller()).name;

	data.topic = 'VMODULE';

	// Pad strings
	data.src_fmt   = center(data.src,  21);
	data.topic_fmt = center(data.topic, 9);

	// Colorize strings
	data.src_fmt   = chalk.white(data.src_fmt);
	data.topic_fmt = chalk.pink(data.topic_fmt);

	data.msg_fmt = data.msg;
	// Only colorize log message if it is a string
	if (typeof data.msg_fmt === 'string') {
		data.msg_fmt = chalk.gray(data.msg_fmt);
		data.msg_fmt = colorize(data.msg_fmt);
	}

	// Output formatted string
	data.bus = chalk.pink('VM');
	console.log('[%s] [%s] [%s] %s', data.bus, data.src_fmt, data.topic_fmt, data.msg_fmt);

	// Send log data to WebSocket
	typeof api !== 'undefined' && api.emit('log-tx', data);
} // logModule(data)

// Dynamic log message output
function logSend(data) {
	log.bus({
		bus     : 'sock',
		command : data.host.split('.')[0],
		value   : data.host,
		src     : {
			name : path.parse(caller()).name,
		},
		dst : {
			name : data.dst,
		},
	});
} // logSend(data)

function logSocket(data) {
	// Bounce if we're not supposed to write to stdout
	if (stdoutOK() !== true) return;

	data.orig = {
		method : data.method,
		type   : data.type,
		event  : data.event,
	};

	// Colorize strings
	switch (data.orig.method) {
		case 'tx' : data.method = chalk.red(data.method.toUpperCase()); break;
		default   : data.method = chalk.green(data.method.toUpperCase());
	}

	switch (data.orig.type) {
		case 'client' : data.type = chalk.blue(center(data.type.toUpperCase(), 14));   break;
		default       : data.type = chalk.orange(center(data.type.toUpperCase(), 14));
	}

	data.event = center(data.event, 14);
	switch (data.orig.event) {
		case 'bus-data'          : data.event = chalk.blue(data.event);   break;
		case 'lcd-text'          : data.event = chalk.cyan(data.event);   break;
		case 'log-bus'           : data.event = chalk.green(data.event);  break;
		case 'log-msg'           : data.event = chalk.gray(data.event);   break;
		case 'host-data'         : data.event = chalk.pink(data.event);   break;
		case 'host-data-request' : data.event = chalk.purple(data.event); break;
		default                  : data.event = chalk.orange(data.event);
	}

	// Output formatted string
	data.bus = 'ND';
	console.log('[%s] [%s] [%s] [%s] %s', data.method, data.type, data.event, data.string);

	// Send log data to WebSocket
	typeof api !== 'undefined' && api.emit('log-tx', data);
} // logSocket(data)


module.exports = {
	chalk,

	bus    : logBus,
	change : logChange,
	error  : logError,
	lib    : logLib,
	module : logModule,
	msg    : logMsg,
	send   : logSend,
	socket : logSocket,
};
