const express = require('express');
const app     = express();

// Ghetto workaround so the different interface processes
// have their respective API servers listening on different
// ports
function get_port() {
	switch (app_type) {
		case 'can0' : return config.api.port + 0;
		case 'can1' : return config.api.port + 1;
		case 'dbus' : return config.api.port + 2;
		case 'ibus' : return config.api.port + 3;
		case 'kbus' : return config.api.port + 4;
		case 'lcd'  : return config.api.port + 5;
	}
}

function init(init_callback = null) {
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

	app.listen(get_port(), () => {
		log.msg({ msg : 'Express listening on port ' + get_port() });
	});

	log.msg({ msg : 'Initialized' });

	typeof init_callback === 'function' && process.nextTick(init_callback);
	init_callback = undefined;
}

function term(term_callback = null) {
	log.msg({ msg : 'Terminated' });

	typeof term_callback === 'function' && process.nextTick(term_callback);
	term_callback = undefined;
}

module.exports = {
	// Functions
	init : (init_cb) => { init(init_cb); },
	term : (term_cb) => { term(term_cb); },
};
