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
		type        : app_intf,
		intf        : app_intf || null,
		up          : os.uptime(),
		temperature : null,
		host        : {
			full  : os.hostname(),
			short : os.hostname().split('.')[0],
		},
		cpu : {
			arch     : os.arch(),
			count    : cpus.length,
			load     : load,
			load_pct : load_pct,
			model    : cpus[0].model,
			speed    : cpus[0].speed,
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

	refresh_temperature();
	refresh();
	broadcast();

	log.msg('Initialized');

	typeof init_callback === 'function' && process.nextTick(init_callback);
	init_callback = undefined;
}

// Cancel timeouts
function term(term_callback = null) {
	if (host_data.timeouts.broadcast !== null) {
		clearTimeout(host_data.timeouts.broadcast);
		host_data.timeouts.broadcast = null;

		log.msg('Unset broadcast timeout');
	}

	if (host_data.timeouts.refresh !== null) {
		clearTimeout(host_data.timeouts.refresh);
		host_data.timeouts.refresh = null;

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
				if (typeof error == 'undefined' || error === null) {
					let temp_value = Math.round(value);
					// Only output temperature message if over 65 C
					let verbose = (temp_value >= 65);

					update.status('system.temperature', temp_value, verbose);
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
				console.log(JSON.stringify(sensors, null, 2));
				let temp_value = Math.round(sensors);

				// Only output temperature message if over 65 C
				let verbose = (temp_value >= 65);

				update.status('system.temperature', temp_value, verbose);
			}).catch((error) => {
				update.status('system.temperature', 0);

				log.msg(host_data.type + ' error: ' + error);
			});
		}
	}

	log.msg('System temp: ' + status.system.temperature + 'c');
}

// Periodically broadcast this host's data to WebSocket clients to update them
function broadcast() {
	if (host_data.timeouts.broadcast === null) {
		log.msg('Set broadcast timeout (' + config.system.host_data.refresh_interval + 'ms)');
	}

	send();

	host_data.timeouts.broadcast = setTimeout(broadcast, config.system.host_data.refresh_interval);
}

// Refresh host data
function refresh() {
	refresh_temperature();

	update.status('system.up', os.uptime(), false);

	let loadavg = os.loadavg();
	update.status('system.cpu.load.0', loadavg[0], false);
	update.status('system.cpu.load.1', loadavg[1], false);
	update.status('system.cpu.load.3', loadavg[3], false);

	update.status('system.memory.free',  os.freemem(),  false);
	update.status('system.memory.total', os.totalmem(), false);

	let free_pct = status.system.memory.free / status.system.memory.total;
	free_pct = free_pct * 100;
	free_pct = free_pct.toFixed(2);
	free_pct = parseFloat(free_pct);

	let load_pct = status.system.cpu.load[0] / status.system.cpu.count;
	load_pct = load_pct * 100;
	load_pct = load_pct.toFixed(2);
	load_pct = parseFloat(load_pct);

	update.status('system.memory.free_pct', free_pct, false);
	update.status('system.cpu.load_pct',    load_pct, false);

	if (host_data.timeouts.refresh === null) {
		log.msg('Set refresh timeout (' + config.system.host_data.refresh_interval + 'ms)');
	}

	host_data.timeouts.refresh = setTimeout(refresh, config.system.host_data.refresh_interval);
}

// Send this host's data to connected services to update them
function send() {
	// log.msg('Sending host data');
	socket.send('host-data', status.system);
}

// Configure event listeners
function init_listeners() {
	socket.on('recv-host-data-request', send);

	log.msg('Initialized event listeners');
}


module.exports = {
	// Variables
	check_result : null,
	type         : null,

	timeouts : {
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
