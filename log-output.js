/* eslint no-console: 0 */

const caller = require('callers-path');
const chalk  = require('chalk');
const path   = require('path');


// 24bit color palette
const color = {
	black  : chalk.rgb(48, 48, 48),
	blue   : chalk.rgb(51, 152, 219),
	cyan   : chalk.rgb(0, 200, 200),
	green  : chalk.rgb(47, 223, 100),
	gray   : chalk.rgb(172, 172, 172),
	orange : chalk.rgb(255, 153, 50),
	pink   : chalk.rgb(178, 0, 140),
	purple : chalk.rgb(114, 83, 178),
	red    : chalk.rgb(231, 76, 60),
	white  : chalk.rgb(224, 224, 224),
	yellow : chalk.rgb(255, 204, 50),

	boldblack  : chalk.bold.rgb(48, 48, 48),
	boldblue   : chalk.bold.rgb(51, 152, 219),
	boldcyan   : chalk.bold.rgb(0, 200, 200),
	boldgreen  : chalk.bold.rgb(47, 223, 100),
	boldgray   : chalk.bold.rgb(172, 172, 172),
	boldorange : chalk.bold.rgb(255, 153, 50),
	boldpink   : chalk.bold.rgb(178, 0, 140),
	boldpurple : chalk.bold.rgb(114, 83, 178),
	boldred    : chalk.bold.rgb(231, 76, 60),
	boldwhite  : chalk.bold.rgb(224, 224, 224),
	boldyellow : chalk.bold.rgb(255, 204, 50),

	italicblack  : chalk.italic.rgb(48, 48, 48),
	italicblue   : chalk.italic.rgb(51, 152, 219),
	italiccyan   : chalk.italic.rgb(0, 200, 200),
	italicgreen  : chalk.italic.rgb(47, 223, 100),
	italicgray   : chalk.italic.rgb(172, 172, 172),
	italicorange : chalk.italic.rgb(255, 153, 50),
	italicpink   : chalk.italic.rgb(178, 0, 140),
	italicpurple : chalk.italic.rgb(114, 83, 178),
	italicred    : chalk.italic.rgb(231, 76, 60),
	italicwhite  : chalk.italic.rgb(224, 224, 224),
	italicyellow : chalk.italic.rgb(255, 204, 50),
};


// If     in a TTY, output to stdout
// If NOT in a TTY, only output to stdout if config.console.output is truthy
function stdoutOK() {
	return process.stdout._type === 'tty' || typeof config !== 'object' || config?.console?.output;
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
	length = parseInt(length);

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
	string = string.replace('Event:', color.purple('Event:'));

	// Yellow
	string = string.replace('Attempting',    color.yellow('Attempting'));
	string = string.replace('Checking',      color.yellow('Checking'));
	string = string.replace('Closing',       color.yellow('Closing'));
	string = string.replace('Configuring',   color.yellow('Configuring'));
	string = string.replace('Connecting',    color.yellow('Connecting'));
	string = string.replace('Ending',        color.yellow('Ending'));
	string = string.replace('Initializing',  color.yellow('Initializing'));
	string = string.replace('Instantiating', color.yellow('Instantiating'));
	string = string.replace('Opening',       color.yellow('Opening'));
	string = string.replace('Reconnecting',  color.yellow('Reconnecting'));
	string = string.replace('Removing',      color.yellow('Removing'));
	string = string.replace('Resetting',     color.yellow('Resetting'));
	string = string.replace('Setting',       color.yellow('Setting'));
	string = string.replace('Shutting down', color.yellow('Shutting down'));
	string = string.replace('Starting',      color.yellow('Starting'));
	string = string.replace('Stopping',      color.yellow('Stopping'));
	string = string.replace('Terminating',   color.yellow('Terminating'));

	// Red
	string = string.replace(' close',        color.red(' close'));
	string = string.replace(' closed',       color.red(' closed'));
	string = string.replace('Closed',        color.red('Closed'));
	string = string.replace(' disconnected', color.red(' disconnected'));
	string = string.replace('Disconnected',  color.red('Disconnected'));
	string = string.replace('Error',         color.red('Error'));
	string = string.replace(' error',        color.red(' error'));
	string = string.replace('Failed ',       color.red('Failed '));
	string = string.replace('Removed',       color.red('Removed'));
	string = string.replace('SIGINT',        color.red('SIGINT'));
	string = string.replace('SIGTERM',       color.red('SIGTERM'));
	string = string.replace('Shut down',     color.red('Shut down'));
	string = string.replace('Stopped',       color.red('Stopped'));
	string = string.replace('Terminated',    color.red('Terminated'));
	string = string.replace(' not ready',    color.red(' not ready'));
	string = string.replace('Unset',         color.red('Unset'));
	string = string.replace('error',         color.red('error'));
	string = string.replace('false',         color.red('false'));

	// Green
	string = string.replace(' OK',          color.green(' OK'));
	string = string.replace(' connected',   color.green(' connected'));
	string = string.replace(' opened',      color.green(' opened'));
	string = string.replace(' ready',       color.green(' ready'));
	string = string.replace('Configured',   color.green('Configured'));
	string = string.replace('Connected ',   color.green('Connected '));
	string = string.replace('Initialized',  color.green('Initialized'));
	string = string.replace('Instantiated', color.green('Instantiated'));
	string = string.replace('Listening ',   color.green('Listening '));
	string = string.replace('Loaded ',      color.green('Loaded '));
	string = string.replace('Opened',       color.green('Opened'));
	string = string.replace('Read ',        color.green('Read '));
	string = string.replace('Reset ',       color.green('Reset '));
	string = string.replace('Set ',         color.green('Set '));
	string = string.replace('Started',      color.green('Started'));
	string = string.replace('Wrote',        color.green('Wrote'));
	string = string.replace('listening ',   color.green('listening '));
	string = string.replace('true',         color.green('true'));

	return string;
} // colorize(string)

// Colorize data source string by name
function colorizeBySource(orig, fmt) {
	switch (orig) {
		case 'host-data' : return color.green(fmt);
		case 'json'      : return color.purple(fmt);
		case 'gpio'      : return color.red(fmt);
		case 'power'     : return color.red(fmt);
		case 'kodi'      : return color.cyan(fmt);
		case 'socket'    : return color.orange(fmt);
		case 'api'       : return color.orange(fmt);

		default : return color.yellow(fmt);
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
	data.src.name = color.yellow(data.src.name);
	data.dst.name = color.green(data.dst.name);

	// Colorize bus
	switch (data.bus_orig) {
		case 'can0' : data.bus = color.orange('C0'); break;
		case 'can1' : data.bus = color.orange('C1'); break;
		case 'dbus' : data.bus = color.red('DB');    break;
		case 'ibus' : data.bus = color.cyan('IB');   break;
		case 'kbus' : data.bus = color.yellow('KB'); break;
		case 'node' : data.bus = color.purple('ND'); break;
		default     : data.bus = color.pink(data.bus);
	}

	// Colorize command
	switch (data.topic_orig) {
		case 'ack' : data.topic = color.green(data.topic);  break;
		case 'bro' : data.topic = color.purple(data.topic); break;
		case 'con' : data.topic = color.red(data.topic);    break;
		case 'rep' : data.topic = color.green(data.topic);  break;
		case 'req' : data.topic = color.cyan(data.topic);   break;
		case 'sta' :
		case 'upd' : data.topic = color.blue(data.topic); break;
		default    : data.topic = color.yellow(data.topic);
	}

	// Replace and colorize true/false
	data.value = color.gray(data.value);
	data.value = data.value.toString().replace('true', color.green('true')).replace('false', color.red('false'));

	// Render gray arrows
	const arrows = color.gray('>>');

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
	data.src_fmt   = color.blue(data.src_fmt);
	data.topic_fmt = color.cyan(data.topic_fmt);
	data.old       = color.red(data.old.toString());
	data.new       = color.green(data.new.toString());

	// Replace and colorize true/false
	data.old = data.old.toString().replace('true', color.green('true')).replace('false', color.red('false'));
	data.new = data.new.toString().replace('true', color.green('true')).replace('false', color.red('false'));

	// Output formatted string
	data.bus = color.blue('CH');
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
	data.topic_fmt = color.red(data.topic_fmt);
	data.src_fmt   = color.red(data.src_fmt);

	data.msg_fmt = data.msg;

	// Output formatted string
	data.bus = color.red('ER');
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
	data.topic_fmt = color.orange(data.topic_fmt);

	data.msg_fmt = data.msg;
	// Only colorize log message if it is a string
	if (typeof data.msg_fmt === 'string') {
		data.msg_fmt = color.gray(data.msg_fmt);
		data.msg_fmt = colorize(data.msg_fmt);
	}

	// Output formatted string
	data.bus = color.purple('LB');
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
	data.topic_fmt = color.gray(data.topic_fmt);

	data.msg_fmt = data.msg;
	// Only colorize log message if it is a string
	if (typeof data.msg_fmt === 'string') {
		data.msg_fmt = color.gray(data.msg_fmt);
		data.msg_fmt = colorize(data.msg_fmt);
	}

	// Output formatted string
	data.bus = color.gray('ND');
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
	data.src_fmt   = color.white(data.src_fmt);
	data.topic_fmt = color.pink(data.topic_fmt);

	data.msg_fmt = data.msg;
	// Only colorize log message if it is a string
	if (typeof data.msg_fmt === 'string') {
		data.msg_fmt = color.gray(data.msg_fmt);
		data.msg_fmt = colorize(data.msg_fmt);
	}

	// Output formatted string
	data.bus = color.pink('VM');
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
		case 'tx' : data.method = color.red(data.method.toUpperCase()); break;
		default   : data.method = color.green(data.method.toUpperCase());
	}

	switch (data.orig.type) {
		case 'client' : data.type = color.blue(center(data.type.toUpperCase(), 14));   break;
		default       : data.type = color.orange(center(data.type.toUpperCase(), 14));
	}

	data.event = center(data.event, 14);
	switch (data.orig.event) {
		case 'bus-data'          : data.event = color.blue(data.event);   break;
		case 'lcd-text'          : data.event = color.cyan(data.event);   break;
		case 'log-bus'           : data.event = color.green(data.event);  break;
		case 'log-msg'           : data.event = color.gray(data.event);   break;
		case 'host-data'         : data.event = color.pink(data.event);   break;
		case 'host-data-request' : data.event = color.purple(data.event); break;
		default                  : data.event = color.orange(data.event);
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
