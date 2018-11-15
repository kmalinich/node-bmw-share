const os = require('os');

let system_temp;

// Determine supporting library to load
function get_host_data_type() {
	switch (process.arch + process.platform) {
		case 'armlinux'  : return 'pi-temperature';
		case 'x64darwin' : return 'smc';
		case 'x64linux'  : return 'lm_sensors.js';
	}
}

// Check if we can get temp data
// (support is on macOS and RPi)
function check() {
	// Don't check the logic twice, and only notify the first time
	if (host_data.check_result !== null) return host_data.check_result;

	// Save check result
	switch (process.arch + process.platform) {
		case 'armlinux'  : host_data.check_result = true; break;
		case 'x64darwin' : host_data.check_result = true; break;
		case 'x64linux'  : host_data.check_result = true; break;
		default          : host_data.check_result = false;
	}

	// Save host type
	host_data.type = get_host_data_type();

	// Load appropriate temperature library
	system_temp = require(host_data.type);

	log.msg('Check passed: ' + host_data.check_result + ', type: ' + host_data.type);

	return host_data.check_result;
}

// Init all host data
function init(init_callback = null) {
	// Don't run on all nodes
	switch (app_intf) {
		case 'client' : break;

		default : {
			switch (config.zeromq.host) {
				case 'localhost' :
				case '127.0.0.1' : {
					status.system = {
						type : app_intf || null,
						intf : app_intf || null,
						host : {
							full  : os.hostname(),
							short : os.hostname().split('.')[0],
						},
					};

					init_listeners();

					log.msg('Initialized');

					typeof init_callback === 'function' && process.nextTick(init_callback);
					init_callback = undefined;

					return;
				}
			}
		}
	}

	let cpus = os.cpus();
	let load = os.loadavg();

	let free_pct = os.freemem() / os.totalmem();
	free_pct = free_pct * 100;
	free_pct = free_pct.toFixed(2);
	free_pct = parseFloat(free_pct);

	let load_pct = load[0] / cpus.length;
	load_pct = load_pct * 100;
	load_pct = load_pct.toFixed(2);
	load_pct = parseFloat(load_pct);

	status.system = {
		type : app_intf || null,
		intf : app_intf || null,

		up : os.uptime(),

		temperature : null,

		cpu : {
			arch     : os.arch(),
			count    : cpus.length,
			load     : load,
			load_pct : load_pct,
			model    : cpus[0].model,
			speed    : cpus[0].speed,
		},

		host : {
			full  : os.hostname(),
			short : os.hostname().split('.')[0],
		},

		memory : {
			free     : os.freemem(),
			total    : os.totalmem(),
			free_pct : free_pct,
		},

		os : {
			platform : os.platform(),
			type     : os.type(),
			release  : os.release(),
		},
	};

	check();
	refresh_temperature();
	init_listeners();
	refresh();
	broadcast();

	log.msg('Initialized');

	typeof init_callback === 'function' && process.nextTick(init_callback);
	init_callback = undefined;
}

// Cancel timeouts
function term(term_callback = null) {
	if (host_data.timeout.broadcast !== null) {
		clearTimeout(host_data.timeout.broadcast);
		host_data.timeout.broadcast = null;

		log.msg('Unset broadcast timeout');
	}

	if (host_data.timeout.refresh !== null) {
		clearTimeout(host_data.timeout.refresh);
		host_data.timeout.refresh = null;

		log.msg('Unset refresh timeout');
	}

	log.msg('Terminated');

	typeof term_callback === 'function' && process.nextTick(term_callback);
	term_callback = undefined;
}

// Get+save RPi temp
function refresh_temperature() {
	if (!check()) {
		update.status('system.temperature', 0);
		return false;
	}

	switch (host_data.type) {
		case 'pi-temperature' : { // arm
			system_temp.measure((error, value) => {
				if (typeof error === 'undefined' || error === null) {
					let temp_value = Math.round(value);
					// Only output temperature message if over 65 C
					let quiet = (temp_value <= 65);

					update.status('system.temperature', temp_value, quiet);
					return;
				}

				update.status('system.temperature', 0);

				log.msg(host_data.type + ' error: ' + error);
			});
			break;
		}

		case 'smc' : { // x64darwin
			// TC0D : Hackintosh
			// TC0E : 2016 rMBP

			// Either TC0D or TC0E is always 0.. so
			// .. yeah, that's gross

			// Save rounded temp value
			let temp_value = Math.round(system_temp.get('TC0D') + system_temp.get('TC0E'));
			// Only output temperature message if over 65 C
			let verbose = (temp_value >= 65);

			update.status('system.temperature', temp_value, verbose);
			break;
		}

		case 'lm_sensors.js' : { // x64 linux
			system_temp.sensors().then((sensors) => {
				// Using coretemp package temperature
				// Needed to add small config to /etc/sensors.d/coretemp.conf,
				// the lm_sensors.js library doesn't handle sensors with spaces
				// in their names
				let temp_value = Math.round(sensors['coretemp-isa-0000'].sensors['package'].input);

				// Only output temperature message if over 65 C
				let verbose = (temp_value >= 65);

				update.status('system.temperature', temp_value, verbose);
			}).catch((error) => {
				update.status('system.temperature', 0);

				log.msg(host_data.type + ' error: ' + error);
			});
		}
	}

	// log.msg('System temp: ' + status.system.temperature + 'c');
}

// Periodically broadcast this host's data to WebSocket clients to update them
function broadcast() {
	// Don't run on all nodes
	switch (app_intf) {
		case 'client' : break;

		default : {
			switch (config.zeromq.host) {
				case 'localhost' :
				case '127.0.0.1' : {
					status.system = {
						type : app_intf || null,
						intf : app_intf || null,
						host : {
							full  : os.hostname(),
							short : os.hostname().split('.')[0],
						},
					};

					return;
				}
			}
		}
	}

	if (host_data.timeout.broadcast === null) {
		log.msg('Set broadcast timeout (' + config.system.host_data.refresh_interval + 'ms)');
	}

	send();

	host_data.timeout.broadcast = setTimeout(broadcast, config.system.host_data.refresh_interval);
}

// Refresh host data
function refresh() {
	// Don't run on all nodes
	switch (app_intf) {
		case 'client' : break;

		default : {
			switch (config.zeromq.host) {
				case 'localhost' :
				case '127.0.0.1' : {
					status.system = {
						type : app_intf || null,
						intf : app_intf || null,
						host : {
							full  : os.hostname(),
							short : os.hostname().split('.')[0],
						},
					};

					return;
				}
			}
		}
	}

	refresh_temperature();

	update.status('system.up', os.uptime());

	let loadavg = os.loadavg();
	update.status('system.cpu.load.0', loadavg[0]);
	update.status('system.cpu.load.1', loadavg[1]);
	update.status('system.cpu.load.3', loadavg[3]);

	update.status('system.memory.free',  os.freemem());
	update.status('system.memory.total', os.totalmem());

	let free_pct = status.system.memory.free / status.system.memory.total;
	free_pct = free_pct * 100;
	free_pct = free_pct.toFixed(2);
	free_pct = parseFloat(free_pct);

	let load_pct = status.system.cpu.load[0] / status.system.cpu.count;
	load_pct = load_pct * 100;
	load_pct = load_pct.toFixed(2);
	load_pct = parseFloat(load_pct);

	update.status('system.memory.free_pct', free_pct);
	update.status('system.cpu.load_pct',    load_pct);

	if (host_data.timeout.refresh === null) {
		log.msg('Set refresh timeout (' + config.system.host_data.refresh_interval + 'ms)');
	}

	host_data.timeout.refresh = setTimeout(refresh, config.system.host_data.refresh_interval);
}

// Send this host's data to connected services to update them
function send() {
	// log.msg('Sending host data');
	socket.send('host-connect', status.system);
}

// Configure event listeners
function init_listeners() {
	// socket.on('recv-host-data-request', send);

	// Send this host's data on server connection
	update.on('status.server.connected', (data) => {
		if (data.new === true) send();
	});

	log.msg('Initialized listeners');
}


module.exports = {
	// Variables
	check_result : null,
	type         : null,

	timeout : {
		broadcast : null,
		refresh   : null,
	},

	// Functions
	broadcast      : broadcast,
	check          : check,
	init           : init,
	init_listeners : init_listeners,
	refresh        : refresh,
	send           : send,
	term           : term,
};
