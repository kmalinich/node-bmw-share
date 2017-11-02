const object_path = require('object-path');

const express = require('express');
const app     = express();
const server  = require('http').Server(app);

// Only load socket.io server if this is the client app
const io = require('socket.io')(server);

// Ghetto workaround so the different interface processes
// have their respective API servers listening on different
// ports
function get_port() {
	switch (app_intf) {
		case 'can0'   : return config.api.port;
		case 'can1'   : return config.api.port + 1;
		case 'client' : return config.api.port + 2;
		case 'dbus'   : return config.api.port + 3;
		case 'ibus'   : return config.api.port + 4;
		case 'kbus'   : return config.api.port + 5;
		case 'lcd'    : return config.api.port + 6;
		default       : return config.api.port + 7;
	}
}

function emit(topic, data, emit_cb = null) {
	// Bounce if this isn't the client app
	if (app_intf !== 'client') {
		typeof emit_cb === 'function' && process.nextTick(emit_cb);
		emit_cb = undefined;
		return;
	}

	io.emit(topic, data);
	// log.msg({ msg : 'Emitted ' + topic + ' message' });

	typeof emit_cb === 'function' && process.nextTick(emit_cb);
	emit_cb = undefined;
}

function init_client(init_client_cb = null) {
	// Only load socket.io server if this is the client app
	if (app_intf !== 'client') {
		log.msg({ msg : 'Not loading client-only API functions' });

		typeof init_client_cb === 'function' && process.nextTick(init_client_cb);
		init_client_cb = undefined;
		return;
	}

	io.on('connection', (socket) => {
		socket.on('disconnect', (reason) => {
			log.msg({ msg : 'socket.io client disconnected, reason: ' + reason });
		});

		log.msg({ msg : 'socket.io client connected' });

		let array_status = [
			'engine',
			'fuel',
			'lcm',
			'obc',
			'system',
			'temperature',
			'vehicle',
		];

		array_status.forEach((key) => {
			let keys = {
				stub : key.split('.')[0],
				full : key,
			};

			let values = {
				stub : object_path.get(status, key),
				full : status[keys.stub],
			};

			api.emit('status-tx', { key : keys, value : values });
		});

		// Force refresh data
		setTimeout(() => {
			IKE.obc_refresh();
		}, 500);
	});

	app.get('/lcm', (req, res) => {
		// LCM.api_command(query_string.parse(request.body));
		res.send(req.params);
	});

	log.msg({ msg : 'Initialized client-only API functions' });

	typeof init_client_cb === 'function' && process.nextTick(init_client_cb);
	init_client_cb = undefined;
}

function init(init_cb = null) {
	app.all('*', (req, res, next) => {
		log.msg({ msg : '[' + req.method + '] ' + req.originalUrl });
		res.set('Content-Type', 'application/json');
		next();
	});

	app.get('/config', (req, res) => {
		res.send(config);
	});

	app.get('/console', (req, res) => {
		update.config('console.output', !config.console.output);
		res.send(config.console);
	});

	app.get('/status', (req, res) => {
		res.send(status);
	});

	server.listen(get_port(), () => {
		log.msg({ msg : 'Express listening on port ' + get_port() });
	});

	init_client(init_cb);
}

function term(term_cb = null) {
	log.msg({ msg : 'Terminated' });

	typeof term_cb === 'function' && process.nextTick(term_cb);
	term_cb = undefined;
}

module.exports = {
	// Main functions
	emit : emit,

	// Start/stop functions
	init : init,
	term : term,
};
