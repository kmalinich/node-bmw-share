const os = require('os');

let system_temp;

// Determine supporting library to load
function get_host_data_type() {
	switch (process.arch + process.platform) {
		case 'armlinux' : return 'pi-temperature';

		default : return null;
	}
}

// Check if we can get temp data
function check() {
	// Don't check the logic twice, and only notify the first time
	if (host_data.check_result !== null) return host_data.check_result;

	// Save check result
	switch (process.arch + process.platform) {
		case 'armlinux' : host_data.check_result = true; break;
		default         : host_data.check_result = false;
	}

	// Save host type
	host_data.type = get_host_data_type();

	// Load appropriate temperature library
	system_temp = require(host_data.type);

	log.lib('Check passed: ' + host_data.check_result + ', type: ' + host_data.type);

	return host_data.check_result;
}

// Init all host data
function init(init_callback = null) {
	// Don't run on all nodes
	if (app_intf !== 'client') {
		log.lib('Initialized');

		typeof init_callback === 'function' && process.nextTick(init_callback);
		init_callback = undefined;

		return;
	}

	init_listeners();

	log.lib('Initialized');

	typeof init_callback === 'function' && process.nextTick(init_callback);
	init_callback = undefined;

	const cpus = os.cpus();
	const load = os.loadavg();

	const free_pct = num.round2(os.freemem() * 100 / os.totalmem());

	const load_pct = num.round2(load[0] * 100 / cpus.length);

	status.system = {
		type : app_intf || null,
		intf : app_intf || null,

		up : os.uptime(),

		temperature : null,

		cpu : {
			arch  : os.arch(),
			count : cpus.length,
			load,
			load_pct,
			model : cpus[0].model,
			speed : cpus[0].speed,
		},

		host : {
			full  : os.hostname(),
			short : os.hostname().split('.')[0],
		},

		memory : {
			free  : os.freemem(),
			total : os.totalmem(),
			free_pct,
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

	log.lib('Initialized');

	typeof init_callback === 'function' && process.nextTick(init_callback);
	init_callback = undefined;
}

// Cancel timeouts
function term(term_callback = null) {
	if (host_data.timeout.broadcast !== null) {
		clearTimeout(host_data.timeout.broadcast);
		host_data.timeout.broadcast = null;

		log.lib('Unset broadcast timeout');
	}

	if (host_data.timeout.refresh !== null) {
		clearTimeout(host_data.timeout.refresh);
		host_data.timeout.refresh = null;

		log.lib('Unset refresh timeout');
	}

	log.lib('Terminated');

	typeof term_callback === 'function' && process.nextTick(term_callback);
	term_callback = undefined;
}

// Get+save RPi temp
function refresh_temperature() {
	if (!check()) {
		update.status('system.temperature', 0);
		return false;
	}

	if (host_data.type !== 'pi-temperature') return;

	system_temp.measure((error, value) => {
		if (typeof error === 'undefined' || error === null) {
			const temp_value = Math.round(value);
			// Only output temperature message if over 65 C
			const quiet = (temp_value <= 65);

			update.status('system.temperature', temp_value, quiet);
			return;
		}

		update.status('system.temperature', 0);

		log.lib(host_data.type + ' error: ' + error);
	});

	// log.lib('System temp: ' + status.system.temperature + 'c');
}

// Periodically broadcast this host's data to WebSocket clients to update them
function broadcast() {
	// Don't run on all nodes
	if (app_intf !== 'client') return;

	if (host_data.timeout.broadcast === null) {
		log.lib('Set broadcast timeout (' + config.system.host_data.refresh_interval + 'ms)');
	}

	send();

	host_data.timeout.broadcast = setTimeout(broadcast, config.system.host_data.refresh_interval);
}

// Refresh host data
function refresh() {
	// Don't run on all nodes
	if (app_intf !== 'client') return;

	refresh_temperature();

	update.status('system.up', os.uptime());

	const loadavg = os.loadavg();
	update.status('system.cpu.load.0', loadavg[0]);
	update.status('system.cpu.load.1', loadavg[1]);
	update.status('system.cpu.load.2', loadavg[2]);
	update.status('system.cpu.load.3', loadavg[3]);

	update.status('system.memory.free',  num.round2(os.freemem() / 1048576));
	update.status('system.memory.total', num.round2(os.totalmem() / 1048576));

	const free_pct = num.round2(status.system.memory.free * 100 / status.system.memory.total);
	const load_pct = num.round2(status.system.cpu.load[0] * 100 / status.system.cpu.count);

	update.status('system.memory.free_pct', free_pct);
	update.status('system.cpu.load_pct',    load_pct);

	if (host_data.timeout.refresh === null) {
		log.lib('Set refresh timeout (' + config.system.host_data.refresh_interval + 'ms)');
	}

	host_data.timeout.refresh = setTimeout(refresh, config.system.host_data.refresh_interval);
}

// Send this host's data to connected services to update them
function send() {
	// log.lib('Sending host data');
	socket.send('host-connect', status.system);
}

// Configure event listeners
function init_listeners() {
	// socket.on('recv-host-data-request', send);

	// Send this host's data on server connection
	update.on('status.server.connected', (data) => {
		if (data.new === true) send();
	});

	log.lib('Initialized listeners');
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
	broadcast,
	check,
	init,
	init_listeners,
	refresh,
	send,
	term,
};
