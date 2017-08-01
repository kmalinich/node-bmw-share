/* global host_data log status config app_type app_intf socket */

const module_name = __filename.slice(__dirname.length + 1, -3).replace('-', '_');

const os = require('os');

let system_temp;

// Check if we can get temp data
// (support is on macOS and RPi)
function check(check_callback = null) {
	// Don't check the logic twice, and only notify the first time
	if (host_data.check_result === null) {
		// Save check result
		host_data.check_result = (process.arch == 'arm' || process.platform == 'darwin');

		// Save host type
		host_data.type = process.arch == 'arm' && 'pi-temperature' || 'smc';

		// Load appropriate temperature library
		system_temp = require(host_data.type);

		log.module({
			src : module_name,
			msg : 'Check passed: '+host_data.check_result+', type: '+host_data.type,
		});
	}

	if (typeof check_callback === 'function') check_callback();
	check_callback = undefined;

	return host_data.check_result;
}

// Init all host data
function init(init_callback = null) {
	let cpus = os.cpus();
	let load = os.loadavg();

	let free_pct = os.freemem()/os.totalmem();
	free_pct = free_pct*100;
	free_pct = free_pct.toFixed(2);
	free_pct = parseFloat(free_pct);

	let load_pct = load[0]/cpus.length;
	load_pct = load_pct*100;
	load_pct = load_pct.toFixed(2);
	load_pct = parseFloat(load_pct);

	status.system = {
		type : app_type,
		intf : app_intf || null,
		up : os.uptime(),
		temperature : null,
		host : {
			full : os.hostname(),
			short : os.hostname().split('.')[0],
		},
		cpu : {
			arch : os.arch(),
			count : cpus.length,
			load : load,
			load_pct : load_pct,
			model : cpus[0].model,
			speed : cpus[0].speed,
		},
		memory : {
			free : os.freemem(),
			total : os.totalmem(),
			free_pct : free_pct,
		},
		os : {
			platform : os.platform(),
			type : os.type(),
			release : os.release(),
		},
	};

	refresh_temperature();
	refresh();
	broadcast();

	log.module({
		src : module_name,
		msg : 'Initialized',
	});

	if (typeof init_callback === 'function') init_callback();
	init_callback = undefined;
}

// Cancel timeouts
function term(term_callback = null) {
	if (host_data.timeouts.broadcast !== null) {
		clearTimeout(host_data.timeouts.broadcast);
		host_data.timeouts.broadcast = null;

		log.module({
			src : module_name,
			msg : 'Unset broadcast timeout',
		});
	}

	if (host_data.timeouts.refresh !== null) {
		clearTimeout(host_data.timeouts.refresh);
		host_data.timeouts.refresh = null;

		log.module({
			src : module_name,
			msg : 'Unset refresh timeout',
		});
	}

	log.module({
		src : module_name,
		msg : 'Terminated',
	});

	if (typeof term_callback === 'function') term_callback();
	term_callback = undefined;
}

// Get+save RPi temp
function refresh_temperature() {
	if (!check()) {
		status.system.temperature = 0;
		return false;
	}

	switch (host_data.type) {
		case 'pi-temperature':
			system_temp.measure((error, value) => {
				if (typeof error == 'undefined' || error === null) {
					status.system.temperature = Math.round(value);
					return;
				}

				status.system.temperature = 0;

				log.module({
					src : module_name,
					msg : host_data.type+' error: '+error,
				});
			});
			break;

		case 'smc':
			// TC0D : Hackintosh
			// TC0E : 2016 rMBP

			// Either TC0D or TC0E is always 0.. so ..
			// .. yeah, that's gross

			// Save rounded temp value
			status.system.temperature = Math.round(system_temp.get('TC0D')+system_temp.get('TC0E'));
			break;
	}

	// log.module({
	//   src : module_name,
	//   msg : 'System temp: '+status.system.temperature+'c',
	// });
}

// Periodically broadcast this host's data to WebSocket clients to update them
function broadcast() {
	if (host_data.timeouts.broadcast === null) {
		log.module({
			src : module_name,
			msg : 'Set broadcast timeout ('+config.system.host_data.refresh_interval+'ms)',
		});
	}

	send();

	host_data.timeouts.broadcast = setTimeout(broadcast, config.system.host_data.refresh_interval);
}

// Refresh host data
function refresh() {
	refresh_temperature();

	status.system.up = os.uptime();

	status.system.cpu.load = os.loadavg();

	status.system.memory.free  = os.freemem();
	status.system.memory.total = os.totalmem();

	let free_pct = status.system.memory.free/status.system.memory.total;
	free_pct = free_pct*100;
	free_pct = free_pct.toFixed(2);
	free_pct = parseFloat(free_pct);

	let load_pct = status.system.cpu.load[0]/status.system.cpu.count;
	load_pct = load_pct*100;
	load_pct = load_pct.toFixed(2);
	load_pct = parseFloat(load_pct);

	status.system.memory.free_pct = free_pct;
	status.system.cpu.load_pct    = load_pct;

	if (host_data.timeouts.refresh === null) {
		log.module({
			src : module_name,
			msg : 'Set refresh timeout ('+config.system.host_data.refresh_interval+'ms)',
		});
	}

	host_data.timeouts.refresh = setTimeout(refresh, config.system.host_data.refresh_interval);
}

// Send this host's data to WebSocket clients to update them
function send() {
	// log.module({
	// 	src : module_name,
	// 	msg : 'Sending host data',
	// });

	socket.send('host-data', status.system);
}

module.exports = {
	check_result : null,
	type         : null,

	timeouts : {
		broadcast : null,
		refresh   : null,
	},

	check : (check_cb) => { check(check_cb); },
	init  : (init_cb)  => { init(init_cb);   },
	term  : (term_cb)  => { term(term_cb);   },

	broadcast : () => { broadcast(); },
	refresh   : () => { refresh();   },
	send      : () => { send();      },
};
