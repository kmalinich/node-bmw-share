const object_path = require('object-path');

const express = require('express');
const app     = express();
const server  = require('http').Server(app);

// body-parser to handle POSTed JSON
const body_parser = require('body-parser');
app.use(body_parser.json());

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
	// log.msg('Emitted ' + topic + ' message' });

	typeof emit_cb === 'function' && process.nextTick(emit_cb);
	emit_cb = undefined;
}

function init_client(init_client_cb = null) {
	// Only load socket.io server if this is the client app
	if (app_intf !== 'client') {
		log.msg('Not loading client-only API functions');

		typeof init_client_cb === 'function' && process.nextTick(init_client_cb);
		init_client_cb = undefined;
		return;
	}

	io.on('connection', (socket) => {
		socket.on('disconnect', (reason) => {
			log.msg('socket.io client disconnected, reason: ' + reason);
		});

		log.msg('socket.io client connected');

		let array_status = [
			'engine',
			'dme1',
			'fuel',
			'gpio',
			'lcm',
			'obc',
			'system',
			'temperature',
			'vehicle',
		];

		array_status.forEach((key) => {
			socket.emit('status-tx', {
				key : {
					stub : key.split('.')[0],
					full : key,
				},

				value : {
					stub : object_path.get(status, key),
					full : status[key.split('.')[0]],
				},
			});
		});

		// Force refresh data
		setTimeout(() => {
			IKE.obc_refresh();
		}, 500);
	});


	// Some of these are shameful
	app.get('/dme1/encode-316/:rpm', (req, res) => {
		DME1.encode_316(parseInt(req.params.rpm));
		res.send(status.dme1);
	});


	app.get('/dsp/mode/:mode', (req, res) => {
		DSP.dsp_mode(req.params.mode);
		res.send(status.dsp);
	});

	app.get('/dsp/m-audio/:mode', (req, res) => {
		DSP.m_audio(req.params.mode);
		res.send(status.dsp);
	});

	app.get('/dsp/eq/:band/:value', (req, res) => {
		DSP.eq_delta(req.params.band, req.params.value);
		res.send(status.dsp);
	});

	app.get('/dsp/get/:value', (req, res) => {
		DSP.request(req.params.value);
		res.send(status.dsp);
	});

	app.get('/dsp/speaker-test/:command', (req, res) => {
		DSP.speaker_test(req.params.command);
		res.send(status.dsp);
	});

	app.post('/dsp/eq', (req, res) => {
		DSP.eq_encode(req.body);
		res.send(status.dsp);
	});


	app.get('/fem1/backlight/:value', (req, res) => {
		FEM1.backlight(parseInt(req.params.value));
		res.send(status.fem1);
	});


	app.get('/gm/get/:value', (req, res) => {
		GM.request(req.params.value);
		res.send(status.gm);
	});

	app.get('/gm/interior-light/:value', (req, res) => {
		GM.interior_light(parseInt(req.params.value));
		res.send(status.gm);
	});

	app.get('/gm/mirror/:mirror/:action', (req, res) => {
		GM.mirrors({
			action : req.params.action,
			mirror : req.params.mirror,
		});

		res.send(status.gm);
	});

	app.get('/gm/doors/closed/:value', (req, res) => {
		update.status('doors.closed', (req.params.value == 'true'));
		update.status('doors.open',   (req.params.value != 'true'));
		res.send(status.doors);
	});

	app.get('/gm/doors/open/:value', (req, res) => {
		update.status('doors.closed', (req.params.value != 'true'));
		update.status('doors.open',   (req.params.value == 'true'));
		res.send(status.doors);
	});

	app.get('/gm/doors/sealed/:value', (req, res) => {
		update.status('doors.sealed', (req.params.value == 'true'));
		res.send(status.doors);
	});

	app.get('/gm/windows/closed/:value', (req, res) => {
		update.status('windows.closed', (req.params.value == 'true'));
		update.status('windows.open',   (req.params.value != 'true'));
		res.send(status.windows);
	});

	app.get('/gm/windows/open/:value', (req, res) => {
		update.status('windows.closed', (req.params.value != 'true'));
		update.status('windows.open',   (req.params.value == 'true'));
		res.send(status.windows);
	});

	app.post('/gm/decode_status_open', (req, res) => {
		GM.decode_status_open(req.body);
		res.send(status.gm);
	});

	app.post('/gm/locks', (req, res) => {
		GM.locks(req.body);
		res.send(status.gm);
	});

	app.post('/gm/mirrors', (req, res) => {
		GM.mirrors(req.body);
		res.send(status.gm);
	});

	app.post('/gm/windows', (req, res) => {
		GM.windows(req.body);
		res.send(status.gm);
	});


	app.get('/hdmi/cec/command/:action', (req, res) => {
		hdmi_cec.command(req.params.action);
		res.send(status.hdmi.cec);
	});

	app.get('/hdmi/rpi/command/:action', (req, res) => {
		hdmi_rpi.command(req.params.action);
		res.send(status.hdmi.rpi);
	});


	app.get('/gpio/set/:relay/:value', (req, res) => {
		gpio.set(req.params.relay, req.params.value);
		res.send(status.gpio);
	});

	app.get('/gpio/toggle/:relay', (req, res) => {
		gpio.toggle(req.params.relay);
		res.send(status.gpio);
	});


	app.get('/ihka/get/:value', (req, res) => {
		IHKA.request(req.params.value);
		res.send(status.ihka);
	});

	app.get('/ihka/recirc', (req, res) => {
		IHKA.recirc();
		res.send(status.ihka);
	});

	app.post('/ihka/aux', (req, res) => {
		IHKA.aux(req.body);
		res.send(status.ihka);
	});


	app.get('/ike/ignition/:value', (req, res) => {
		IKE.ignition(req.params.value);
		res.send(status.ike);
	});

	app.get('/ike/text/normal/:value', (req, res) => {
		IKE.text(req.params.value);
		res.send(status.ike);
	});

	app.get('/ike/text/nopad/:value', (req, res) => {
		IKE.text_nopad(req.params.value);
		res.send(status.ike);
	});

	app.get('/ike/text/override/:value', (req, res) => {
		IKE.text_override(req.params.value);
		res.send(status.ike);
	});

	app.get('/ike/text/urgent/:value', (req, res) => {
		IKE.text_urgent(req.params.value);
		res.send(status.ike);
	});

	app.get('/ike/text/urgent/off', (req, res) => {
		IKE.text_urgent_off();
		res.send(status.ike);
	});

	app.get('/ike/text/warning/:value', (req, res) => {
		IKE.text_warning(req.params.value);
		res.send(status.ike);
	});

	app.get('/ike/get/:value', (req, res) => {
		IKE.request(req.params.value);
		res.send(status.ike);
	});


	app.get('/lcm/backlight/:value', (req, res) => {
		update.status('lcm.dimmer.value_1', parseInt(req.params.value));
		res.send(status.lcm);
	});

	app.get('/lcm/comfort-turn/:action', (req, res) => {
		update.status('lights.turn.depress_elapsed', 0);
		LCM.comfort_turn_flash(req.params.action);
		res.send(status.lcm);
	});

	app.get('/lcm/get/:value', (req, res) => {
		LCM.request(req.params.value);
		res.send(status.lcm);
	});

	app.get('/lcm/io-encode', (req, res) => {
		LCM.io_encode(req.query);
		res.send(status.lcm);
	});

	app.get('/lcm/police-lights/:action', (req, res) => {
		LCM.police((req.params.action == 'true' || req.params.action == 'on'));
		res.send(status.lcm);
	});

	app.get('/lcm/welcome-lights/:action', (req, res) => {
		LCM.welcome_lights((req.params.action == 'true' || req.params.action == 'on'));
		res.send(status.lcm);
	});


	app.get('/mfl/translate-button-media/:action/:button', (req, res) => {
		MFL.translate_button_media({
			action : req.params.action,
			button : req.params.button,
		});

		res.send(status.mfl);
	});


	app.get('/obc/get/:value', (req, res) => {
		IKE.obc_data('get', req.params.value);
		res.send(status.obc);
	});

	app.get('/obc/get-all', (req, res) => {
		IKE.obc_refresh();
		res.send(status.obc);
	});

	app.get('/obc/set/clock', (req, res) => {
		IKE.obc_clock();
		res.send(status.obc);
	});

	app.get('/obc/reset/:value', (req, res) => {
		IKE.obc_data('reset', req.params.value);
		res.send(status.obc);
	});


	app.get('/power/:state', (req, res) => {
		power.power(req.params.state);
		res.send(status.power);
	});


	app.get('/rls/get/:value', (req, res) => {
		RLS.request(req.params.value);
		res.send(status.rls);
	});

	app.post('/rls/light-control', (req, res) => {
		RLS.light_control_status(req.body);
		res.send(status.rls);
	});


	app.get('/rad/cassette/:command', (req, res) => {
		RAD.cassette_control(req.params.command);
		res.send(status.rad);
	});

	app.get('/rad/power/:command', (req, res) => {
		RAD.audio_power(req.params.command);
		res.send(status.rad);
	});

	app.get('/rad/source/:command', (req, res) => {
		RAD.audio_control(req.params.command);
		res.send(status.rad);
	});

	app.get('/rad/volume/:command', (req, res) => {
		RAD.volume_control(parseInt(req.params.command));
		res.send(status.rad);
	});


	app.post('/tel/led', (req, res) => {
		TEL.led(req.body);
		res.send(status.tel);
	});


	log.msg('Initialized client-only API functions');

	typeof init_client_cb === 'function' && process.nextTick(init_client_cb);
	init_client_cb = undefined;
}

function init(init_cb = null) {
	app.all('*', (req, res, next) => {
		log.msg('[' + req.method + '] ' + req.originalUrl);
		res.set('Content-Type', 'application/json');
		next();
	});

	app.get('/config', (req, res) => {
		res.send(config);
	});

	app.post('/config', (req, res) => {
		config = req.body;
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
		log.msg('Express listening on port ' + get_port());
	});

	init_client(init_cb);
}

function term(term_cb = null) {
	log.msg('Terminated');

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
