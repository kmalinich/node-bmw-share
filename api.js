const express = require('express');
const app     = express();
const server  = require('http').Server(app);
const io      = require('socket.io')(server);

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
	if (app_intf === 'client') return;

	io.emit(topic, data);
	// log.msg({ msg : 'Emitted ' + topic + ' message' });

	typeof emit_cb === 'function' && process.nextTick(emit_cb);
	emit_cb = undefined;
}

function init(init_cb = null) {
	app.all('*', (req, res, next) => {
		log.msg({ msg : '[' + req.method + '] ' + req.originalUrl });
		res.set('Content-Type', 'application/json');
		next();
	});

	app.get('/config', (req, res) => {
		res.send(JSON.stringify(config));
	});

	app.get('/console', (req, res) => {
		update.config('console.output', !config.console.output);
		res.send(JSON.stringify(config.console));
	});

	app.get('/status', (req, res) => {
		res.send(JSON.stringify(status));
	});

	server.listen(get_port(), () => {
		log.msg({ msg : 'Express listening on port ' + get_port() });
	});

	if (app_intf === 'client') {
		io.on('connection', (socket) => {
			log.msg({ msg : 'socket.io client connected' });

			socket.on('disconnect', (reason) => {
				log.msg({ msg : 'socket.io client disconnected, reason: ' + reason });
			});
		});
	}

	log.msg({ msg : 'Initialized' });

	typeof init_cb === 'function' && process.nextTick(init_cb);
	init_cb = undefined;
}

function term(term_cb = null) {
	log.msg({ msg : 'Terminated' });

	typeof term_cb === 'function' && process.nextTick(term_cb);
	term_cb = undefined;
}

module.exports = {
	// Main functions
	emit : (topic, data, emit_cb) => { emit(topic, data, emit_cb); },

	// Start/stop functions
	init : (init_cb) => { init(init_cb); },
	term : (term_cb) => { term(term_cb); },
};
