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


function center(string, length) {
	let character = ' ';

	string = string.toString();
	length  = parseInt(length);

	while (string.length < length) {
		string = character + string;
		if (string.length < length) string = string + character;
	}

	return string;
}

function colorize(string) {
	string = string.toString();

	string = string.replace('Attempting',    chalk.yellow('Attempting'));
	string = string.replace('Connecting',    chalk.yellow('Connecting'));
	string = string.replace('Initializing',  chalk.yellow('Initializing'));
	string = string.replace('Resetting',     chalk.yellow('Resetting'));
	string = string.replace('Shutting down', chalk.yellow('Shutting down'));
	string = string.replace('Starting',      chalk.yellow('Starting'));
	string = string.replace('Stopping',      chalk.yellow('Stopping'));
	string = string.replace('Terminating',   chalk.yellow('Terminating'));

	string = string.replace(' closed',       chalk.red(' closed'));
	string = string.replace(' disconnected', chalk.red(' disconnected'));
	string = string.replace('Disconnected',  chalk.red('Disconnected'));
	string = string.replace('Error',         chalk.red('Error'));
	string = string.replace('Failed ',       chalk.red('Failed '));
	string = string.replace('SIGINT',        chalk.red('SIGINT'));
	string = string.replace('SIGTERM',       chalk.red('SIGTERM'));
	string = string.replace('Shut down',     chalk.red('Shut down'));
	string = string.replace('Stopped',       chalk.red('Stopped'));
	string = string.replace('Terminated',    chalk.red('Terminated'));
	string = string.replace('Unset',         chalk.red('Unset'));
	string = string.replace('error',         chalk.red('error'));
	string = string.replace('false',         chalk.red('false'));

	string = string.replace(' connected',   chalk.green(' connected'));
	string = string.replace(' opened',      chalk.green(' opened'));
	string = string.replace('Connected ',   chalk.green('Connected '));
	string = string.replace('Initialized',  chalk.green('Initialized'));
	string = string.replace('Listening ',   chalk.green('Listening '));
	string = string.replace('Loaded ',      chalk.green('Loaded '));
	string = string.replace('Read ',        chalk.green('Read '));
	string = string.replace('Reset ',       chalk.green('Reset '));
	string = string.replace('Set ',         chalk.green('Set '));
	string = string.replace('Started',      chalk.green('Started'));
	string = string.replace('Wrote',        chalk.green('Wrote'));
	string = string.replace('true',         chalk.green('true'));

	return string;
}

// Should we output to stdout?
function should_not_output() {
	// Err on the side of caution
	if (typeof config                === 'undefined') return false;
	if (typeof config.console        === 'undefined') return false;
	if (typeof config.console.output === 'undefined') return false;

	// If we're in a TTY, output to stdout
	// If we're not, only output if config.console.output is true
	let active_tty = Boolean(process.stdout.isTTY) && Boolean(process.stdin.isTTY);
	switch (active_tty) {
		case false : return !config.console.output;
		case true  : return false;
	}
}


module.exports = {
	// 24bit color chalk-style palette
	chalk : chalk,

	// Dynamic bus message output
	bus : (data) => {
		// Bounce if we're supposed to write to stdout
		if (should_not_output()) return;

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

		// Save original strings
		data.bus_orig      = data.bus;
		data.src.name_orig = data.src.name;
		data.dst.name_orig = data.dst.name;
		data.command_orig  = data.command;

		// Format bus
		data.bus = data.bus.charAt(0).toUpperCase() + data.bus.charAt(1).toUpperCase();

		// Format command
		switch (data.command_orig) {
			case 'ack' : data.command = 'ACK';       break;
			case 'bro' : data.command = 'BROADCAST'; break;
			case 'con' : data.command = 'CONTROL';   break;
			case 'rep' : data.command = 'REPLY';     break;
			case 'req' : data.command = 'REQUEST';   break;
			case 'sta' : data.command = 'STATUS';    break;
			case 'upd' : data.command = 'UPDATE';    break;
			case 'unk' :
			default    :
				data.command = 'UNKNOWN';

				switch (data.bus_orig) {
					case 'can0' :
					case 'can1' : data.value = '0x' + data.src.id.toString(16).toUpperCase(); break;

					default : data.value = '0x' + data.msg.toString(16).toUpperCase();
				}
		}

		// Pad strings
		data.bus      = data.bus.padStart(2);
		data.dst.name = data.dst.name_orig.padEnd(10);
		data.src.name = data.src.name_orig.padStart(9);
		data.command  = center(data.command, 9);

		// Colorize source and destination
		data.src.name = chalk.yellow(data.src.name);
		data.dst.name = chalk.green(data.dst.name);

		// Colorize bus
		switch (data.bus_orig) {
			case 'can0' : data.bus = chalk.orange('C0');     break;
			case 'can1' : data.bus = chalk.orange('C1');     break;
			case 'dbus' : data.bus = chalk.red(data.bus);    break;
			case 'ibus' : data.bus = chalk.cyan(data.bus);   break;
			case 'kbus' : data.bus = chalk.yellow(data.bus); break;
			case 'node' :
			default     : data.bus = chalk.pink(data.bus);
		}

		// Colorize command
		switch (data.command_orig) {
			case 'ack' : data.command = chalk.green(data.command);  break;
			case 'bro' : data.command = chalk.purple(data.command); break;
			case 'con' : data.command = chalk.red(data.command);    break;
			case 'rep' : data.command = chalk.green(data.command);  break;
			case 'req' : data.command = chalk.cyan(data.command);   break;
			case 'sta' :
			case 'upd' : data.command = chalk.blue(data.command); break;
			default    : data.command = chalk.yellow(data.command);
		}

		// Replace and colorize true/false
		data.value = chalk.gray(data.value);
		data.value = data.value.toString().replace('true', chalk.green('true')).replace('false', chalk.red('false'));

		// Render gray arrows
		let arrows = chalk.gray('>>');

		// Output formatted string
		console.log('[%s] [%s%s%s] [%s]', data.bus, data.src.name, arrows, data.dst.name, data.command, data.value);

		// Send log data to WebSocket
		typeof api !== 'undefined' && api.emit('log-tx', data);
	},

	// Formatted output for when a value changes
	change : (data) => {
		// Bounce if we're supposed to write to stdout
		if (should_not_output()) return;

		data.command = 'CHANGE';

		data.src = path.parse(caller()).name;

		// Pad strings
		data.src_fmt     = center(data.src,     21);
		data.command_fmt = center(data.command, 9);

		// Catch nulls
		if (typeof data.old === 'undefined' || data.old === null) data.old = 'null';
		if (typeof data.new === 'undefined' || data.new === null) data.new = 'null';

		// Colorize strings
		data.src_fmt     = chalk.blue(data.src_fmt);
		data.command_fmt = chalk.blue(data.command_fmt);
		data.old         = chalk.red(data.old.toString());
		data.new         = chalk.green(data.new.toString());

		// Replace and colorize true/false
		data.old = data.old.toString().replace('true', chalk.green('true')).replace('false', chalk.red('false'));
		data.new = data.new.toString().replace('true', chalk.green('true')).replace('false', chalk.red('false'));

		// Output formatted string
		data.bus = chalk.gray('ND');
		console.log('[%s] [%s] [%s] %s: \'%s\'', data.bus, data.src_fmt, data.command_fmt, data.value, data.new);

		// Send log data to WebSocket
		typeof api !== 'undefined' && api.emit('log-tx', data);
	},

	msg : (data) => {
		// Bounce if we're supposed to write to stdout
		if (should_not_output()) return;

		// Handle single-string input
		if (typeof data === 'string') data = { msg : data };

		data.src = path.parse(caller()).name;

		data.src_orig = data.src;

		data.command = 'MESSAGE';

		// Pad strings
		data.src_fmt     = center(data.src,     21);
		data.command_fmt = center(data.command, 9);

		// Colorize strings
		data.command_fmt = chalk.gray(data.command_fmt);

		switch (data.src_orig) {
			case 'main'      : data.src_fmt = chalk.green(data.src_fmt);  break;
			case 'json'      : data.src_fmt = chalk.purple(data.src_fmt); break;
			case 'gpio'      : data.src_fmt = chalk.red(data.src_fmt);    break;
			case 'host-data' : data.src_fmt = chalk.green(data.src_fmt);  break;
			case 'kodi'      : data.src_fmt = chalk.cyan(data.src_fmt);   break;
			case 'socket'    : data.src_fmt = chalk.blue(data.src_fmt);   break;
			default          : data.src_fmt = chalk.yellow(data.src_fmt);
		}

		data.msg_fmt = data.msg;
		data.msg_fmt = chalk.gray(data.msg_fmt);
		data.msg_fmt = colorize(data.msg_fmt);

		// Output formatted string
		data.bus = chalk.gray('ND');
		console.log('[%s] [%s] [%s] %s', data.bus, data.src_fmt, data.command_fmt, data.msg_fmt);

		// Send log data to WebSocket
		typeof api !== 'undefined' && api.emit('log-tx', data);
	},

	module : (data) => {
		// Bounce if we're supposed to write to stdout
		if (should_not_output()) return;

		// Handle single-string input
		if (typeof data === 'string') data = { msg : data };

		data.src = path.parse(caller()).name;

		data.mod = 'MODULE';

		data.msg = data.msg.toString();

		// Pad strings
		data.src_fmt = center(data.src, 21);
		data.mod_fmt = center(data.mod, 9);
		data.msg_fmt = data.msg;

		// Colorize strings
		data.src_fmt = chalk.white(data.src_fmt);
		data.mod_fmt = chalk.orange(data.mod_fmt);
		data.msg_fmt = colorize(data.msg_fmt);

		// Output formatted string
		data.bus = chalk.gray('ND');
		console.log('[%s] [%s] [%s] %s', data.bus, data.src_fmt, data.mod_fmt, data.msg_fmt);

		// Send log data to WebSocket
		typeof api !== 'undefined' && api.emit('log-tx', data);
	},

	// Dynamic log message output
	send : (data) => {
		// Bounce if we're supposed to write to stdout
		if (should_not_output()) return;

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
	},

	socket : (data) => {
		// Bounce if we're supposed to write to stdout
		if (should_not_output()) return;

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
	},
};
